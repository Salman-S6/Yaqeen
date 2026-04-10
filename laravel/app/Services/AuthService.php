<?php
namespace App\Services;

use App\Models\User;
use App\Models\Citizen;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Services\IdentityVerificationService;
class AuthService
{
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
////////////////////////////////////////////////////////////////////
            // app(IdentityVerificationService::class)->
            // verify($citizen, $data['id_image']);

            return $user->load('citizen');
        });
    }

    public function login($data)
    {
        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            throw new \Exception('Invalid credentials');
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token
        ];
    }

    public function logout($user)
    {
        $user->tokens()->delete();
    }
}