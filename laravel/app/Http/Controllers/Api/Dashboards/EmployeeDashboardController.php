<?php

namespace App\Http\Controllers\Api\Dashboards;

use App\Http\Controllers\Controller;
use App\Services\Dashboards\EmployeeDashboardService;
use App\Http\Resources\DashboardRequestResource;
use Illuminate\Http\Request;

class EmployeeDashboardController extends Controller
{
    public function __construct(protected EmployeeDashboardService $dashboardService) {}

    public function index(Request $request)
    {
        $employeeId = $request->user()->id;

        $metrics = $this->dashboardService->getMetrics($employeeId);
        $latestRequests = $this->dashboardService->getLatestAssignedRequests($employeeId);

        return response()->json([
            'status' => 'success',
            'data' => [
                'kpis' => $metrics,
                'latest_assigned_requests' => DashboardRequestResource::collection($latestRequests),
            ]
        ]);
    }
}
