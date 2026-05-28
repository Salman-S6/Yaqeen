<?php

use App\Http\Controllers\VerificationController;
use Illuminate\Support\Facades\Route;

Route::get('/verify', [VerificationController::class, 'verifyPublic'])->name('document.verify.public');
