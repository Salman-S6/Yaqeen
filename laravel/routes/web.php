<?php

use App\Http\Controllers\VerificationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['throttle:30,1'])
    ->get('/verify', [VerificationController::class, 'verifyPublic'])
    ->name('document.verify.public');
