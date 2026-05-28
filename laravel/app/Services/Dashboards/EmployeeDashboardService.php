<?php

namespace App\Services\Dashboards;

use App\Models\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class EmployeeDashboardService
{
    const SLA_HOURS = 24;

    public function getMetrics(int $employeeId): array
    {
        $baseQuery = Request::where('assigned_employee_id', $employeeId);

        $pendingCount = (clone $baseQuery)->where('status', 'pending')->count();
        $approvedCount = (clone $baseQuery)->where('status', 'approved')->count();

        $slaBreaches = (clone $baseQuery)
            ->where('status', 'pending')
            ->where('submitted_at', '<', Carbon::now()->subHours(self::SLA_HOURS))
            ->count();

        $avgReviewTime = (clone $baseQuery)
            ->whereNotNull('resolved_at')
            ->whereNotNull('assigned_at')
            ->select(DB::raw('AVG(TIMESTAMPDIFF(HOUR, assigned_at, resolved_at)) as avg_time'))
            ->value('avg_time');

        return [
            'pending_requests' => $pendingCount,
            'approved_requests' => $approvedCount,
            'sla_breaches_today' => $slaBreaches,
            'average_review_time' => round((float) $avgReviewTime, 1),
        ];
    }

    public function getLatestAssignedRequests(int $employeeId, int $limit = 5)
    {
        return Request::with(['citizen.user', 'serviceType'])
            ->where('assigned_employee_id', $employeeId)
            ->where('status', 'pending')
            ->orderBy('submitted_at', 'asc')
            ->take($limit)
            ->get();
    }
}
