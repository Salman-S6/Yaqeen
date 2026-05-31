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
            'id_image' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ];
    }

    public function messages(): array
    {
        return [
            'first_name.required' => 'الاسم الأول مطلوب.',
            'first_name.max' => 'الاسم الأول لا يمكن أن يكون أكثر من 255 حرف.',

            'last_name.required' => 'الاسم الأخير مطلوب.',
            'last_name.max' => 'الاسم الأخير لا يمكن أن يكون أكثر من 255 حرف.',

            'email.required' => 'البريد الإلكتروني مطلوب.',
            'email.email' => 'البريد الإلكتروني يجب أن يكون عنوانًا إلكترونيًا صالحًا.',
            'email.unique' => 'البريد الإلكتروني مستخدم بالفعل.',

            'password.required' => 'كلمة المرور مطلوبة.',
            'password.min' => 'كلمة المرور يجب أن تكون على الأقل 8 أحرف.',
            'password.confirmed' => 'تأكيد كلمة المرور لا يتطابق.',

            'national_id.required' => 'الرقم الوطني مطلوب.',
            'national_id.size' => 'الرقم الوطني يجب أن يكون 11 أحرف.',
            'national_id.unique' => 'الرقم الوطني مستخدم بالفعل.',

            'father_name.required' => 'اسم الأب مطلوب.',
            'father_name.max' => 'اسم الأب لا يمكن أن يكون أكثر من 255 حرف.',

            'mother_first_name.required' => 'اسم الأم الأول مطلوب.',
            'mother_first_name.max' => 'اسم الأم الأول لا يمكن أن يكون أكثر من 255 حرف.',

            'mother_last_name.required' => 'اسم الأم الأخير مطلوب.',
            'mother_last_name.max' => 'اسم الأم الأخير لا يمكن أن يكون أكثر من 255 حرف.',

            'date_of_birth.required' => 'تاريخ الميلاد مطلوب.',
            'date_of_birth.date' => 'تاريخ الميلاد يجب أن يكون تاريخًا صحيحًا.',

            'place_of_registration.required' => 'مكان التسجيل مطلوب.',

            'id_image.mimes' => 'صورة الهوية يجب أن تكون ملفًا من النوع: jpg, jpeg, png, pdf.',
            'id_image.max' => 'صورة الهوية لا يمكن أن تكون أكبر من 5MB.',
        ];
    }
}
