<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminEmployeePerformanceResource extends JsonResource
{
    public function toArray(Request $request)
    {
        $employee = $this['employee'];

        return [
            'id' => $employee->id,
            'name' => trim("{$employee->first_name} {$employee->last_name}"),
            'processed_requests' => $this['processed_count'],
            'avg_processing_time' => round($this['avg_process_time'], 1).' ساعة',
            'sla_breaches' => $this['sla_breaches'],
            'acceptance_rate' => round($this['acceptance_rate']).'%',
            'performance_score' => round($this['performance_score']),
        ];
    }
}
