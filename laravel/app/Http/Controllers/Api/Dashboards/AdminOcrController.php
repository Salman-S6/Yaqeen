<?php

namespace App\Http\Controllers\Api\Dashboards;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminOcrResultResource;
use App\Services\Dashboards\AdminOcrService;

class AdminOcrController extends Controller
{
    public function __construct(protected AdminOcrService $ocrService) {}

    public function index()
    {
        $data = $this->ocrService->getDashboardData();

        return response()->json([
            'status' => 'success',
            'data' => [
                'kpis' => $data['kpis'],
                'ocr_logs' => AdminOcrResultResource::collection($data['logs'])->response()->getData(true),
            ],
        ]);
    }
}
