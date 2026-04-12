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
            'id_image' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ];
    }

    public function messages(): array
    {
        return [
            'first_name.required' => 'First name is required.',
            'first_name.max' => 'First name may not be greater than 255 characters.',

            'last_name.required' => 'Last name is required.',
            'last_name.max' => 'Last name may not be greater than 255 characters.',

            'email.required' => 'Email is required.',
            'email.email' => 'Email must be a valid email address.',
            'email.unique' => 'Email is already taken.',

            'password.required' => 'Password is required.',
            'password.min' => 'Password must be at least 8 characters.',
            'password.confirmed' => 'Password confirmation does not match.',

            'national_id.required' => 'National ID is required.',
            'national_id.size' => 'National ID must be 11 characters long.',
            'national_id.unique' => 'National ID is already taken.',

            'father_name.required' => 'Father name is required.',
            'father_name.max' => 'Father name may not be greater than 255 characters.',

            'mother_first_name.required' => 'Mother first name is required.',
            'mother_first_name.max' => 'Mother first name may not be greater than 255 characters.',

            'mother_last_name.required' => 'Mother last name is required.',
            'mother_last_name.max' => 'Mother last name may not be greater than 255 characters.',

            'date_of_birth.required' => 'Date of birth is required.',
            'date_of_birth.date' => 'Date of birth must be a valid date.',

            'place_of_registration.required' => 'Place of registration is required.',

            'id_image.mimes' => 'The ID image must be a file of type: jpg, jpeg, png, pdf.',
            'id_image.max' => 'The ID image may not be greater than 5MB.',
        ];
    }
}
