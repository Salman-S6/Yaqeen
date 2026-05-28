<?php

namespace App\Http\Controllers\Api\Dashboards;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminEmployeePerformanceResource;
use App\Services\Dashboards\AdminDashboardService;

class AdminDashboardController extends Controller
{
    public function __construct(protected AdminDashboardService $dashboardService) {}

    public function index()
    {
        $data = $this->dashboardService->getDashboardData();

        return response()->json([
            'status' => 'success',
            'data' => [
                'kpis' => $data['kpis'],
                'employee_performance' => AdminEmployeePerformanceResource::collection($data['employees']),
            ],
        ]);
    }
}
