<?php

namespace App\Services;

use App\Models\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AutoAssignService
{
    /**
     * تعيين الطلب للموظف الأقل عبئاً (UC-18 — Load Balancing)
     *
     * المنطق: نحسب عدد الطلبات النشطة (pending + under_review) لكل موظف
     * ونختار من له العدد الأقل — عادل وبسيط.
     *
     * إذا لم يوجد أي موظف نشط: نسجّل تحذيراً ونترك الطلب بدون تعيين (assigned_employee_id = null)
     * حتى يتدخل المدير يدوياً.
     */
    public function assign(Request $request): void
    {
        $employee = $this->findLeastBusyEmployee();

        if (! $employee) {
            Log::warning('AutoAssignService: لا يوجد موظفون نشطون — الطلب بقي بدون تعيين', [
                'request_id'     => $request->id,
                'request_number' => $request->request_number,
            ]);
            return;
        }

        $request->update([
            'assigned_employee_id' => $employee->id,
            'assigned_at'          => now(),
        ]);

        Log::info('AutoAssignService: تم تعيين الطلب', [
            'request_id'     => $request->id,
            'request_number' => $request->request_number,
            'employee_id'    => $employee->id,
            'employee_name'  => $employee->first_name . ' ' . $employee->last_name,
        ]);
    }

    /**
     * إيجاد الموظف الأقل عبئاً
     *
     * يستعلم عن جميع الموظفين النشطين ويرتبهم حسب عدد طلباتهم الحالية
     * (الطلبات بحالة pending أو under_review فقط — لأن approved/rejected لا تمثل عبئاً)
     *
     * @return User|null
     */
    private function findLeastBusyEmployee(): ?User
    {
        return User::role('employee')
            ->where('status', 'active')
            ->withCount([
                // نحسب الطلبات غير المنتهية فقط
                'assignedRequests as active_requests_count' => function ($query) {
                    $query->whereIn('status', ['pending', 'under_review']);
                },
            ])
            ->orderBy('active_requests_count', 'asc')
            // عند التساوي نختار الأقدم تسجيلاً (FIFO بسيط)
            ->orderBy('id', 'asc')
            ->first();
    }
}