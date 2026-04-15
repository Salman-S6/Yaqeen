<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    protected $service;

    public function __construct(AuthService $service)
    {
        $this->service = $service;
    }

    public function register(RegisterRequest $request)
    {
        $user = $this->service->register($request->validated());

        return response()->json([
            'user' => new UserResource($user),
        ]);
    }

    public function login(LoginRequest $request)
    {
        $data = $this->service->login($request->validated());

        return response()->json([
            'user' => new UserResource($data['user']),
            'token' => $data['token'],
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user()->load('citizen.attachments');

        return new UserResource($user);
    }

    public function logout()
    {
        $this->service->logout(Auth::user());

        return response()->json(['message' => 'Logged out']);
    }
}
