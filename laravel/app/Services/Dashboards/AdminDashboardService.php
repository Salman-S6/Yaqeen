<?php

namespace App\Services\Dashboards;

use App\Models\User;
use Carbon\Carbon;

class AdminDashboardService
{
    const SLA_HOURS = 24;

    public function getDashboardData(): array
    {
        $employees = User::role('employee')->with('assignedRequests')->get();

        $totalResolvedOverall = 0;
        $totalWithinSlaOverall = 0;
        $weeklySlaBreaches = 0;

        $employeeStats = [];
        $oneWeekAgo = Carbon::now()->subDays(7);

        foreach ($employees as $employee) {
            $requests = $employee->assignedRequests;

            $resolvedRequests = $requests->whereNotNull('resolved_at');
            $resolvedCount = $resolvedRequests->count();

            $approvedCount = $resolvedRequests->where('status', 'approved')->count();
            $acceptanceRate = $resolvedCount > 0 ? ($approvedCount / $resolvedCount) * 100 : 0;

            $totalProcessTime = 0;
            $breaches = 0;
            $withinSla = 0;

            foreach ($requests as $req) {
                if ($req->resolved_at) {
                    $processTime = $req->assigned_at
                        ? $req->assigned_at->floatDiffInHours($req->resolved_at)
                        : $req->submitted_at->floatDiffInHours($req->resolved_at);

                    $totalProcessTime += $processTime;

                    $totalWaitTime = $req->submitted_at->floatDiffInHours($req->resolved_at);

                    if ($totalWaitTime > self::SLA_HOURS) {
                        $breaches++;
                        if ($req->resolved_at >= $oneWeekAgo) {
                            $weeklySlaBreaches++;
                        }
                    } else {
                        $withinSla++;
                    }
                } else {
                    $currentWaitTime = $req->submitted_at->floatDiffInHours(now());
                    if ($currentWaitTime > self::SLA_HOURS) {
                        $breaches++;
                        $weeklySlaBreaches++;
                    }
                }
            }

            $totalResolvedOverall += $resolvedCount;
            $totalWithinSlaOverall += $withinSla;

            $avgProcessTime = $resolvedCount > 0 ? ($totalProcessTime / $resolvedCount) : 0;

            $performanceScore = $resolvedCount > 0 ? ($withinSla / $resolvedCount) * 100 : 0;

            $employeeStats[] = [
                'employee' => $employee,
                'processed_count' => $resolvedCount,
                'avg_process_time' => $avgProcessTime,
                'sla_breaches' => $breaches,
                'acceptance_rate' => $acceptanceRate,
                'performance_score' => $performanceScore,
            ];
        }

        $teamEfficiency = $totalResolvedOverall > 0
            ? round(($totalWithinSlaOverall / $totalResolvedOverall) * 100)
            : 0;

        usort($employeeStats, fn ($a, $b) => $b['performance_score'] <=> $a['performance_score']);

        $topPerformer = $employeeStats[0]['employee'] ?? null;
        $topPerformerName = $topPerformer ? trim("{$topPerformer->first_name} {$topPerformer->last_name}") : 'لا يوجد بيانات';

        return [
            'kpis' => [
                'weekly_sla_breaches' => $weeklySlaBreaches,
                'team_efficiency' => $teamEfficiency,
                'top_performer_name' => $topPerformerName,
            ],
            'employees' => $employeeStats,
        ];
    }
}
