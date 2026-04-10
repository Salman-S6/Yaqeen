<?php

use App\Http\Controllers\Api\RequestController;
use App\Http\Controllers\Api\ServiceTypeController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\Admin\EmployeeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



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
});

Route::group(['prefix' => 'service-types', ], function () {
    
    // عرض جميع أنواع الخدمات
    Route::get('/', [ServiceTypeController::class, 'index'])
        ->middleware('permission:view service types');

    // عرض نوع خدمة واحد
    Route::get('/{service_type}', [ServiceTypeController::class, 'show'])
        ->middleware('permission:view service types');

    // إنشاء نوع خدمة جديد
    Route::post('/', [ServiceTypeController::class, 'store']);
        // ->middleware('permission:create service types');

    // تحديث نوع خدمة
    Route::put('/{service_type}', [ServiceTypeController::class, 'update'])
        ->middleware('permission:update service types');

    // حذف نوع خدمة
    Route::delete('/{service_type}', [ServiceTypeController::class, 'destroy'])
        ->middleware('permission:delete service types');
});




Route::middleware(['auth:sanctum', 'check.permission:manage employees'])
    ->prefix('admin')
    ->group(function () {

        Route::post('/employees', [EmployeeController::class, 'store']);
        Route::get('/employees', [EmployeeController::class, 'index']);
        Route::get('/employees/{id}', [EmployeeController::class, 'show']);
        Route::delete('/employees/{id}', [EmployeeController::class, 'destroy']);
    });