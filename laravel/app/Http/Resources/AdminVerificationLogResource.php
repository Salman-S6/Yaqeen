<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AdminVerificationLogResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'request_number' => $this->document->request->request_number ?? 'غير متوفر',
            'organization' => $this->verifier_organization ?? 'جهة غير معروفة',
            'result' => $this->result,
            'time' => $this->verified_at->format('g:i a'),
            'date' => $this->verified_at->format('j F'),
            'ip_address' => $this->ip_address ?? 'غير متوفر',
        ];
    }
}
