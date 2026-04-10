<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RequestResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'request_number' => $this->request_number,
            'status' => $this->status,

            'citizen' => [
                'id' => $this->citizen?->id,
                'first_name' => $this->citizen?->user?->first_name,
                'last_name' => $this->citizen?->user?->last_name,
                'father_name' => $this->citizen?->father_name,
                'mother_first_name' => $this->citizen?->mother_first_name,
                'mother_last_name' => $this->citizen?->mother_last_name,
                'national_id' => $this->citizen?->user?->national_id,
                'date_of_birth' => $this->citizen?->date_of_birth,
                'place_of_registration' => $this->citizen?->place_of_registration,
            ],

            'service_type' => [
                // 'id' => $this->serviceType?->id,
                'name' => $this->serviceType?->name,
            ],

            'employee' => $this->assignedEmployee?->user?->first_name,

            'submitted_at' => $this->submitted_at,
            'assigned_at' => $this->assigned_at,
            'resolved_at' => $this->resolved_at,
        ];
    }
}
