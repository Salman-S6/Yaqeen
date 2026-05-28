<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Dashboards\AdminStatsService;

class AdminStatsController extends Controller
{
    public function __construct(protected AdminStatsService $statsService) {}

    public function index()
    {
        $data = $this->statsService->getDashboardStats();

        return response()->json([
            'status' => 'success',
            'data' => $data,
        ]);
    }
}
