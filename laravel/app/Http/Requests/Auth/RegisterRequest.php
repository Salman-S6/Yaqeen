<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

            // User
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
            'national_id' => 'required|string|size:11|unique:users,national_id',

            // Citizen
            'father_name' => 'required|string|max:255',
            'mother_first_name' => 'required|string|max:255',
            'mother_last_name' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'place_of_registration' => 'required|string',

            // ID Image
            // 'id_image' => 'required|file|mimes:jpg,png,pdf|max:2048'
        ];
    }
}
