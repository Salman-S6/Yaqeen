<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminOcrResultResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [
            'id' => $this->id,
            'citizen_name' => $this->extracted_first_name.' '.$this->extracted_last_name,
            'national_id' => $this->extracted_national_id,
            'confidence_score' => round($this->confidence_score).'%',
            'engine_used' => $this->engine_used ?? 'gemini-2.5-flash',
            'date' => $this->processed_at ? $this->processed_at->format('j F Y') : '',

            'details' => [
                'first_name' => $this->extracted_first_name,
                'last_name' => $this->extracted_last_name,
                'father_name' => $this->extracted_father_name ?? 'غير متوفر',
                'mother_full_name' => trim($this->extracted_mother_first_name.' '.$this->extracted_mother_last_name),
                'birth_info' => ($this->extracted_place ?? '').' '.($this->extracted_dob ? $this->extracted_dob->format('Y/m/d') : ''),
                'national_id' => $this->extracted_national_id,
            ],
        ];
    }
}
