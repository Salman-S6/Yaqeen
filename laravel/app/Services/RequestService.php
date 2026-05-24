<?php

namespace App\Services;

use App\Models\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class RequestService
{
    public function __construct(
        protected NotificationService $notificationService,
        protected AutoAssignService   $autoAssignService,
    ) {}

    /**
     * جلب الطلبات حسب دور المستخدم:
     * - المواطن  → طلباته هو فقط
     * - الموظف  → الطلبات المعيّنة له
     * - الأدمن  → كل الطلبات
     */
    public function getAll(User $user): \Illuminate\Pagination\LengthAwarePaginator
    {
        $query = Request::with(['citizen.user', 'serviceType', 'assignedEmployee'])
            ->latest();

        if ($user->hasRole('citizen')) {
            $query->where('citizen_id', $user->citizen?->id);
        } elseif ($user->hasRole('employee')) {
            $query->where('assigned_employee_id', $user->id);
        }

        return $query->paginate(15);
    }

    /**
     * إنشاء الطلب ثم تعيينه تلقائياً للموظف الأقل عبئاً
     */
    public function create(array $data, User $user): Request
    {
        $citizen = $user->citizen;

        if (! $citizen) {
            throw new \Exception('لا يوجد ملف مواطن مرتبط بهذا الحساب.');
        }

        return DB::transaction(function () use ($data, $citizen) {

            $request = Request::create([
                'request_number'  => $this->generateRequestNumber(),
                'citizen_id'      => $citizen->id,
                'service_type_id' => $data['service_type_id'],
                'status'          => 'pending',
                'submitted_at'    => now(),
            ]);

            // تعيين تلقائي للموظف الأقل عبئاً فور إنشاء الطلب
            $this->autoAssignService->assign($request);

            return $request->load(['citizen.user', 'serviceType', 'assignedEmployee']);
        });
    }

    public function approve(int $requestId): Request
    {
        return DB::transaction(function () use ($requestId) {

            $request = Request::with([
                'citizen.user',
                'serviceType',
                'assignedEmployee',
            ])->findOrFail($requestId);

            $request->update([
                'status'      => 'approved',
                'resolved_at' => now(),
            ]);

            // إرسال إشعار البريد للمواطن بشكل Async
            $this->notificationService->sendApproval($request);

            return $request;
        });
    }

    public function reject(int $requestId, string $reason, User $employee): Request
    {
        return DB::transaction(function () use ($requestId, $reason, $employee) {

            $request = Request::with([
                'citizen.user',
                'serviceType',
                'assignedEmployee',
            ])->findOrFail($requestId);

            $request->update([
                'status'      => 'rejected',
                'resolved_at' => now(),
            ]);

            // تسجيل سبب الرفض في جدول منفصل
            $request->rejectionReason()->create([
                'employee_id' => $employee->id,
                'reason'      => $reason,
            ]);

            // إرسال إشعار البريد للمواطن مع السبب بشكل Async
            $this->notificationService->sendRejection($request, $reason);

            return $request->load(['citizen.user', 'serviceType', 'assignedEmployee', 'rejectionReason']);
        });
    }

    public function findById(int $id, User $user): Request
    {
        $query = Request::with([
            'citizen.user',
            'citizen.attachments',
            'serviceType',
            'assignedEmployee',
            'rejectionReason',
            'attachments',
        ]);

        // المواطن لا يستطيع رؤية طلبات غيره
        if ($user->hasRole('citizen')) {
            $query->where('citizen_id', $user->citizen?->id);
        }

        return $query->findOrFail($id);
    }

    private function generateRequestNumber(): string
    {
        $today = now()->format('Ymd');

        $count = Request::whereDate('created_at', today())->count() + 1;

        return 'REQ-' . $today . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);
    }
}