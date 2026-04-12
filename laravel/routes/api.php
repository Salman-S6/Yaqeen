<?php

use App\Http\Controllers\Api\AttachmentController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\RequestController;
use App\Http\Controllers\Api\ServiceTypeController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {

    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
    });
});

Route::middleware('auth:sanctum')->group(function () {

    // عرض كل الطلبات
    Route::get('/requests', [RequestController::class, 'index'])
        ->middleware('check.permission:view requests');

    // إنشاء طلب
    Route::post('/requests', [RequestController::class, 'store'])
        ->middleware('check.permission:create requests');

    // عرض طلب واحد
    Route::get('/requests/{id}', [RequestController::class, 'show'])
        ->middleware('check.permission:view requests');

    // تعيين موظف
    Route::post('/requests/{id}/assign', [RequestController::class, 'assign'])
        ->middleware('check.permission:assign requests');

    // مسارات المرفقات الآمنة
    Route::prefix('attachments')->group(function () {

        // مسار رفع مرفق جديد
        Route::post('/', [AttachmentController::class, 'store'])
            ->middleware('check.permission:upload attachments'); // استخدام الصلاحية من الـ Seeder الخاص بكم

        // مسار عرض المرفق (مهم جداً إعطاؤه اسم name ليتمكن الريسورس من استدعائه)
        Route::get('/{id}/view', [AttachmentController::class, 'view'])
            ->name('attachments.view')
            ->middleware('check.permission:view attachments');
    });

    Route::prefix('service-types')->group(function () {

        // عرض جميع أنواع الخدمات
        Route::get('/', [ServiceTypeController::class, 'index'])
            ->middleware('check.permission:view service types');

        // عرض نوع خدمة واحد
        Route::get('/{service_type}', [ServiceTypeController::class, 'show'])
            ->middleware('check.permission:view service types');

        // إنشاء نوع خدمة جديد
        Route::post('/', [ServiceTypeController::class, 'store'])
            ->middleware('permission:create service types');

        // تحديث نوع خدمة
        Route::put('/{service_type}', [ServiceTypeController::class, 'update'])
            ->middleware('check.permission:update service types');

        // حذف نوع خدمة
        Route::delete('/{service_type}', [ServiceTypeController::class, 'destroy'])
            ->middleware('check.permission:delete service types');
    });

    Route::middleware('check.permission:manage employees')
        ->prefix('admin')
        ->group(function () {

            Route::post('/employees', [EmployeeController::class, 'store']);
            Route::get('/employees', [EmployeeController::class, 'index']);
            Route::get('/employees/{id}', [EmployeeController::class, 'show']);
            Route::delete('/employees/{id}', [EmployeeController::class, 'destroy']);
        });
});
