<?php

namespace App\Http\Requests\Attachment;

use Illuminate\Foundation\Http\FormRequest;

class StoreAttachmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // التحقق من الصلاحيات يتم عبر الـ Middleware
    }

    public function rules(): array
    {
        return [
            'file' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'attachable_type' => 'required|string',
            'attachable_id' => 'required|integer',
            'type' => 'nullable|string|max:50',
        ];
    }

    public function messages(): array
    {
        return [
            'file.max' => 'file size must be less than 5MB.',
            'file.mimes' => 'only files of type: jpg, png, pdf are allowed.',
        ];
    }
}
