<?php

namespace App\Services\Dashboards;

use App\Models\Request;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AdminStatsService
{
    public function getDashboardStats(): array
    {
        $totalCitizens = User::role('citizen')->count();
        $todayCitizens = User::role('citizen')->whereDate('created_at', Carbon::today())->count();

        $totalRequests = Request::count();

        $avgProcessingTime = Request::whereNotNull('resolved_at')
            ->whereNotNull('assigned_at')
            ->select(DB::raw('AVG(TIMESTAMPDIFF(HOUR, assigned_at, resolved_at)) as avg_time'))
            ->value('avg_time');

        $totalResolved = Request::whereNotNull('resolved_at')->count();
        $pendingCount = Request::where('status', 'pending')->count();
        $approvedCount = Request::where('status', 'approved')->count();
        $rejectedCount = Request::where('status', 'rejected')->count();

        $acceptanceRate = $totalResolved > 0 ? round(($approvedCount / $totalResolved) * 100) : 0;

        $statusDistribution = [
            'approved' => $approvedCount,
            'pending' => $pendingCount,
            'rejected' => $rejectedCount,
        ];

        $dailyRequests = [];
        $arabicDays = [
            'Sunday' => 'الأحد', 'Monday' => 'الاثنين', 'Tuesday' => 'الثلاثاء',
            'Wednesday' => 'الأربعاء', 'Thursday' => 'الخميس', 'Friday' => 'الجمعة', 'Saturday' => 'السبت',
        ];

        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $dayName = $arabicDays[$date->format('l')];

            $count = Request::whereDate('created_at', $date)->count();

            $dailyRequests[] = [
                'day' => $dayName,
                'count' => $count,
                'date' => $date->format('Y-m-d'),
            ];
        }

        return [
            'kpis' => [
                'total_citizens' => $totalCitizens,
                'today_citizens' => $todayCitizens,
                'avg_processing_time' => round((float) $avgProcessingTime, 1),
                'acceptance_rate' => $acceptanceRate,
                'total_requests' => $totalRequests,
            ],
            'charts' => [
                'status_distribution' => $statusDistribution,
                'daily_requests' => $dailyRequests,
            ],
        ];
    }
}
