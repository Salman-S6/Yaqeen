<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CitizenResource extends JsonResource
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
            // جلب البيانات الأساسية من علاقة المستخدم (User)
            'first_name' => $this->user->first_name,
            'last_name' => $this->user->last_name,
            'email' => $this->user->email,
            'national_id' => $this->user->national_id,

            // بيانات المواطن الخاصة
            'father_name' => $this->father_name,
            'mother_first_name' => $this->mother_first_name,
            'mother_last_name' => $this->mother_last_name,
            'date_of_birth' => $this->date_of_birth,
            'place_of_registration' => $this->place_of_registration,

            // جلب المرفقات (مثل صورة الهوية) باستخدام ريسورس المرفقات الذي أنشأناه
            'attachments' => AttachmentResource::collection($this->whenLoaded('attachments')),

            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
