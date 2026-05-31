<?php

namespace App\Services;

use App\Models\Request;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class AutoAssignService
{
    public function getAvailableEmployee(): ?User
    {
        return User::role('employee')
            ->where('status', 'active')
            ->withCount([
                'assignedRequests as active_requests_count' => function ($query) {
                    $query->whereIn('status', ['pending']);
                },
            ])
            ->orderBy('active_requests_count', 'asc')
            ->orderBy('id', 'asc')
            ->first();
    }

    public function assign(Request $request): bool
    {
        $employee = $this->findLeastBusyEmployee();

        if (! $employee) {
            Log::warning('AutoAssignService: لا يوجد موظفون نشطون — الطلب بقي بدون تعيين', [
                'request_id' => $request->id,
                'request_number' => $request->request_number,
            ]);

            return false;
        }

        $request->update([
            'assigned_employee_id' => $employee->id,
            'assigned_at' => now(),
        ]);

        Log::info('AutoAssignService: تم تعيين الطلب', [
            'request_id' => $request->id,
            'request_number' => $request->request_number,
            'employee_id' => $employee->id,
            'employee_name' => $employee->first_name.' '.$employee->last_name,
        ]);

        return true;
    }

    private function findLeastBusyEmployee(): ?User
    {
        return User::role('employee')
            ->where('status', 'active')
            ->withCount([
                'assignedRequests as active_requests_count' => function ($query) {
                    $query->whereIn('status', ['pending']);
                },
            ])
            ->orderBy('active_requests_count', 'asc')
            ->orderBy('id', 'asc')
            ->first();
    }
}
