<?php

use App\Http\Controllers\Api\AttachmentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Dashboards\AdminDashboardController;
use App\Http\Controllers\Api\Dashboards\EmployeeDashboardController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\RequestController;
use App\Http\Controllers\Api\ServiceTypeController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {

    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
    });
});

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    /*
    |----------------------------------------------------------------------
    | Requests
    |----------------------------------------------------------------------
    */
    Route::prefix('requests')->group(function () {

        Route::get('/', [RequestController::class, 'index'])
            ->middleware('check.permission:view_requests');

        Route::post('/', [RequestController::class, 'store'])
            ->middleware('check.permission:create_requests');

        Route::get('/{id}', [RequestController::class, 'show'])
            ->middleware('check.permission:view_requests');

        Route::post('/{id}/approve', [RequestController::class, 'approve'])
            ->middleware('check.permission:approve_requests');

        Route::post('/{id}/reject', [RequestController::class, 'reject'])
            ->middleware('check.permission:reject_requests');
    });

    /*
    |----------------------------------------------------------------------
    | Attachments
    |----------------------------------------------------------------------
    */
    Route::prefix('attachments')->group(function () {

        Route::post('/', [AttachmentController::class, 'store'])
            ->middleware('check.permission:upload_attachments');
    });

    /*
    |----------------------------------------------------------------------
    | Service Types
    |----------------------------------------------------------------------
    */
    Route::prefix('service-types')->group(function () {

        Route::get('/', [ServiceTypeController::class, 'index'])
            ->middleware('check.permission:view_service_types');

        Route::get('/{service_type}', [ServiceTypeController::class, 'show'])
            ->middleware('check.permission:view_service_types');

        Route::post('/', [ServiceTypeController::class, 'store'])
            ->middleware('check.permission:create_service_types');

        Route::put('/{service_type}', [ServiceTypeController::class, 'update'])
            ->middleware('check.permission:update_service_types');

        Route::delete('/{service_type}', [ServiceTypeController::class, 'destroy'])
            ->middleware('check.permission:delete_service_types');
    });

    /*
    |----------------------------------------------------------------------
    | Admin — Employee Management
    |----------------------------------------------------------------------
    */
    Route::middleware('check.permission:manage_employees')
        ->prefix('admin')
        ->group(function () {
            Route::get('/dashboard', [AdminDashboardController::class, 'index']);

            Route::get('/employees', [EmployeeController::class, 'index']);
            Route::post('/employees', [EmployeeController::class, 'store']);
            Route::get('/employees/{id}', [EmployeeController::class, 'show']);
            Route::put('/employees/{id}', [EmployeeController::class, 'update']);
            Route::delete('/employees/{id}', [EmployeeController::class, 'destroy']);
        });

    /*
    |----------------------------------------------------------------------
    | Employee Dashboard
    |----------------------------------------------------------------------
    */
    Route::prefix('employee')->group(function () {

        Route::get('/dashboard', [EmployeeDashboardController::class, 'index'])
            ->middleware('check.permission:view_requests');

    });
});

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// رابط عرض المرفق — موقّع (Signed URL) لا يحتاج auth لكنه محمي بالتوقيع
Route::get('/attachments/{id}/view', [AttachmentController::class, 'view'])
    ->name('attachments.view')
    ->middleware('signed');
