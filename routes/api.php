<?php

use App\Http\Controllers\Api\AttachmentController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\RequestController;
use App\Http\Controllers\Api\ServiceTypeController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {

    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('me',       [AuthController::class, 'me']);
        Route::post('logout',  [AuthController::class, 'logout']);
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
            ->middleware('check.permission:view requests');

        Route::post('/', [RequestController::class, 'store'])
            ->middleware('check.permission:create requests');

        Route::get('/{id}', [RequestController::class, 'show'])
            ->middleware('check.permission:view requests');

        // Route::post('/{id}/assign', [RequestController::class, 'assign'])
        //     ->middleware('check.permission:assign requests');

        Route::post('/{id}/approve', [RequestController::class, 'approve'])
            ->middleware('check.permission:approve requests');

        Route::post('/{id}/reject', [RequestController::class, 'reject'])
            ->middleware('check.permission:reject requests');
    });

    /*
    |----------------------------------------------------------------------
    | Attachments
    |----------------------------------------------------------------------
    */
    Route::prefix('attachments')->group(function () {

        Route::post('/', [AttachmentController::class, 'store'])
            ->middleware('check.permission:upload attachments');
    });

    /*
    |----------------------------------------------------------------------
    | Service Types
    |----------------------------------------------------------------------
    */
    Route::prefix('service-types')->group(function () {

        Route::get('/', [ServiceTypeController::class, 'index'])
            ->middleware('check.permission:view service types');

        Route::get('/{service_type}', [ServiceTypeController::class, 'show'])
            ->middleware('check.permission:view service types');

        Route::post('/', [ServiceTypeController::class, 'store'])
            ->middleware('check.permission:create service types');

        Route::put('/{service_type}', [ServiceTypeController::class, 'update'])
            ->middleware('check.permission:update service types');

        Route::delete('/{service_type}', [ServiceTypeController::class, 'destroy'])
            ->middleware('check.permission:delete service types');
    });

    /*
    |----------------------------------------------------------------------
    | Admin — Employee Management
    |----------------------------------------------------------------------
    */
    Route::middleware('check.permission:manage employees')
        ->prefix('admin')
        ->group(function () {

            Route::get('/employees',        [EmployeeController::class, 'index']);
            Route::post('/employees',       [EmployeeController::class, 'store']);
            Route::get('/employees/{id}',   [EmployeeController::class, 'show']);
            Route::put('/employees/{id}',   [EmployeeController::class, 'update']);
            Route::delete('/employees/{id}',[EmployeeController::class, 'destroy']);
        });
});

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// رابط عرض المرفق — موقّع (Signed URL) لا يحتاج auth لكنه محمي بالتوقيع
// Route::get('/attachments/{id}/view', [AttachmentController::class, 'view'])
//     ->name('attachments.view')
//     ->middleware('signed');