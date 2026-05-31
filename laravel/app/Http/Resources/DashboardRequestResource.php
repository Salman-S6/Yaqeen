<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardRequestResource extends JsonResource
{
    public function toArray(Request $request)
    {
        $waitTimeInHours = (int) round(Carbon::now()->floatDiffInHours($this->submitted_at));
        $isSlaBreached = $waitTimeInHours >= 24;

        $citizenName = $this->citizen && $this->citizen->user
            ? $this->citizen->user->first_name.' '.$this->citizen->user->last_name
            : 'غير متوفر';

        return [
            'id' => $this->id,
            'request_number' => $this->request_number,
            'citizen_name' => $citizenName,
            'service_type' => $this->serviceType?->name,
            'submitted_date' => $this->submitted_at?->format('Y/m/d'),

            'wait_time_text' => $this->formatWaitTime($waitTimeInHours),
            'wait_time_hours' => $waitTimeInHours,
            'is_sla_breached' => $isSlaBreached,
        ];
    }

    private function formatWaitTime(int $hours): string
    {
        if ($hours === 0) {
            return 'أقل من ساعة';
        }
        if ($hours === 1) {
            return 'ساعة واحدة';
        }
        if ($hours === 2) {
            return 'ساعتان';
        }
        if ($hours >= 3 && $hours <= 10) {
            return $hours.' ساعات';
        }

        return $hours.' ساعة';
    }
}
