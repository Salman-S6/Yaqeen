<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->first_name.' '.$this->last_name,
            'mother_name' => $this->citizen?->mother_first_name.' '.$this->citizen?->mother_last_name,
            'father_name' => $this->citizen?->father_name,
            'national_id' => $this->national_id,
            'date_of_birth' => $this->citizen?->date_of_birth,
            'place_of_registration' => $this->citizen?->place_of_registration,
            'email' => $this->email,
            'roles' => $this->getRoleNames(),
            'citizen_details' => new CitizenResource($this->whenLoaded('citizen')),
        ];
    }
}
