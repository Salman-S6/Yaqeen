<?php

namespace App\Http\Requests\Employee;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $employeeId = $this->route('id');

        return [
            'first_name' => 'sometimes|required|string',
            'last_name' => 'sometimes|required|string',
            'national_id' => [
                'sometimes',
                'required',
                'string',
                'size:11',
                Rule::unique('users', 'national_id')->ignore($employeeId),
            ],
            'email' => [
                'sometimes',
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($employeeId),
            ],
            'password' => 'nullable|string|min:8',
            'status' => 'sometimes|required|in:active,inactive,suspended',
        ];
    }
}
