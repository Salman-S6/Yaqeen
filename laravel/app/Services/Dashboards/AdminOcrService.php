<?php

namespace App\Services\Dashboards;

use App\Models\OCRResult;

class AdminOcrService
{
    public function getDashboardData(): array
    {
        $avgConfidence = OCRResult::avg('confidence_score');

        $totalProcessed = OCRResult::count();

        $activeEngine = OCRResult::latest('processed_at')->value('engine_used') ?? 'غير محدد';

        $logs = OCRResult::latest('processed_at')->paginate(15);

        return [
            'kpis' => [
                'avg_confidence' => round((float) $avgConfidence) . '%',
                'total_processed' => $totalProcessed,
                'active_engine' => $activeEngine,
            ],
            'logs' => $logs
        ];
    }
}
