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

            $ocrResult = app(OCRService::class)->process($data['id_image']);

            $verificationService = app(IdentityVerificationService::class);

            $score = $verificationService->calculateScore($citizen, $ocrResult['data'] ?? $ocrResult);

            if ($score < 70) {
                throw ValidationException::withMessages([
                    'id_image' => ['بيانات الهوية المرفقة لا تتطابق بشكل كافٍ مع البيانات المدخلة. (نسبة المطابقة: '.$score.'%، المطلوب 70% كحد أدنى).'],
                ]);
            }

            $attachment = $this->attachmentService->store(
                file: $data['id_image'],
                attachableModel: $citizen,
                uploaderId: $user->id,
                attachmentType: 'identity_card'
            );

            app(OCRService::class)->saveResult($attachment->id, $ocrResult, $score);

            $citizen->update([
                'is_verified' => $score >= 70,
                'verified_at' => now(),
            ]);

            return [
                'user' => $user->load(['citizen.attachments']),
                'token' => $user->createToken('api-token')->plainTextToken,
            ];
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

        if ($user->status === 'suspended') {
            throw ValidationException::withMessages(['email' => ['حسابك موقوف - يرجى التواصل مع الإدارة.']]);
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
