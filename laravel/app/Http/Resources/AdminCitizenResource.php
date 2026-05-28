<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AdminCitizenResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,

            'full_name' => $this->user?->first_name . ' ' . $this->user?->last_name,
            'national_id' => $this->user?->national_id,
            'registration_date' => $this->created_at?->format('Y-m-d'),
            'is_verified' => (bool) $this->is_verified,
            'account_status' => $this->user?->status ?? 'active',

            'email' => $this->user?->email,
            'father_name' => $this->father_name,
            'mother_full_name' => trim($this->mother_first_name . ' ' . $this->mother_last_name),
            'date_of_birth' => $this->date_of_birth?->format('Y-m-d'),
            'place_of_registration' => $this->place_of_registration,

            'attachments' => AttachmentResource::collection($this->whenLoaded('attachments')),
        ];
    }
}
