<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\URL;

class RequestResource extends JsonResource
{
    public function toArray($request): array
    {
        $identityAttachment = $this->whenLoaded('citizen', function () {
            return $this->citizen?->attachments
                ->where('type', 'identity_card')
                ->first();
        });

        $identityImageUrl = $identityAttachment
            ? URL::signedRoute('attachments.view', ['id' => $identityAttachment->id])
            : null;

        return [
            'id' => $this->id,
            'request_number' => $this->request_number,
            'status' => $this->status,

            'citizen' => $this->when($this->relationLoaded('citizen'), fn () => [
                'id' => $this->citizen?->id,
                'first_name' => $this->citizen?->user?->first_name,
                'last_name' => $this->citizen?->user?->last_name,
                'father_name' => $this->citizen?->father_name,
                'mother_first_name' => $this->citizen?->mother_first_name,
                'mother_last_name' => $this->citizen?->mother_last_name,
                'national_id' => $this->citizen?->user?->national_id,
                'date_of_birth' => $this->citizen?->date_of_birth?->format('Y-m-d'),
                'place_of_registration' => $this->citizen?->place_of_registration,
            ]),

            'identity_image_url' => $identityImageUrl,

            'service_type' => $this->when($this->relationLoaded('serviceType'), fn () => [
                'id' => $this->serviceType?->id,
                'name' => $this->serviceType?->name,
            ]),

            'employee' => $this->when(
                $this->relationLoaded('assignedEmployee') && $this->assignedEmployee,
                fn () => [
                    'id' => $this->assignedEmployee->id,
                    'first_name' => $this->assignedEmployee->first_name,
                    'last_name' => $this->assignedEmployee->last_name,
                    'email' => $this->assignedEmployee->email,
                ]
            ),

            'rejection_reason' => $this->when(
                $this->relationLoaded('rejectionReason') && $this->rejectionReason,
                fn () => $this->rejectionReason?->reason
            ),

            'submitted_at' => $this->submitted_at?->format('Y-m-d H:i:s'),
            'assigned_at' => $this->assigned_at?->format('Y-m-d H:i:s'),
            'resolved_at' => $this->resolved_at?->format('Y-m-d H:i:s'),

            'qr_url' => $this->document && $this->document->qrCode
                ? (json_decode($this->document->qrCode->payload, true)['verify_url'] ?? null)
                : null,
        ];
    }
}
