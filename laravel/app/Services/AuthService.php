<?php

namespace App\Services;

use App\Models\Citizen;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(protected AttachmentService $attachmentService) {}

    public function register($data)
    {
        return DB::transaction(function () use ($data) {

            $user = User::create([
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email'],
                'national_id' => $data['national_id'],
                'password' => Hash::make($data['password']),
            ]);

            $citizen = Citizen::create([
                'user_id' => $user->id,
                'father_name' => $data['father_name'],
                'mother_first_name' => $data['mother_first_name'],
                'mother_last_name' => $data['mother_last_name'],
                'date_of_birth' => $data['date_of_birth'],
                'place_of_registration' => $data['place_of_registration'],
            ]);

            $user->assignRole('citizen');

            // --- رفع صورة الهوية وربطها بالمواطن ---
            // بما أننا داخل Transaction، إذا فشل الرفع لأسباب أمنية (Exception)
            // سيقوم لارافل بالتراجع عن إنشاء الـ User والـ Citizen تلقائياً!
            $this->attachmentService->store(
                file: $data['id_image'],
                attachableModel: $citizen,     // نربط الصورة بملف المواطن
                uploaderId: $user->id,         // المستخدم الذي رفع الصورة هو نفسه من يسجل الآن
                attachmentType: 'identity_card'
            );

            // //////////////////////////////////////////////////////////////////
            // app(IdentityVerificationService::class)->
            // verify($citizen, $data['id_image']);

            return $user->load(['citizen.attachments']);
        });
    }

    public function login($data)
    {
        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['البيانات المدخلة غير صحيحة.'],
            ]);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    public function logout($user)
    {
        $user->tokens()->delete();
    }
}
