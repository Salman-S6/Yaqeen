<?php

use App\Http\Controllers\VerificationController;
use Illuminate\Support\Facades\Route;

// مسار التحقق العام للوثائق (يمكن لأي كاميرا موبايل قراءته)
Route::get('/verify-document/{id}', [VerificationController::class, 'verifyPublic'])->name('document.verify.public');
