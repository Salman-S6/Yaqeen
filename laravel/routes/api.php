<?php

use App\Http\Controllers\Api\AttachmentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Dashboards\Admin\AdminAuditLogController;
use App\Http\Controllers\Api\Dashboards\Admin\AdminCitizenController;
use App\Http\Controllers\Api\Dashboards\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Dashboards\Admin\AdminEmployeePermissionController;
use App\Http\Controllers\Api\Dashboards\Admin\AdminOcrController;
use App\Http\Controllers\Api\Dashboards\Admin\AdminStatsController;
use App\Http\Controllers\Api\Dashboards\Admin\AdminVerificationLogController;
use App\Http\Controllers\Api\Dashboards\EmployeeDashboardController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\NotificationController;
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
    | Admin — Management & System Logs
    |----------------------------------------------------------------------
    */
    Route::prefix('admin')->group(function () {
        Route::middleware('check.permission:manage_employees')->group(function () {
            Route::get('/employees', [EmployeeController::class, 'index']);
            Route::post('/employees', [EmployeeController::class, 'store']);
            Route::get('/employees/{id}', [EmployeeController::class, 'show']);
            Route::put('/employees/{id}', [EmployeeController::class, 'update']);
            Route::delete('/employees/{id}', [EmployeeController::class, 'destroy']);

            Route::get('/employees/{id}/permissions', [AdminEmployeePermissionController::class, 'show'])
                ->middleware('check.permission:manage_permissions');
            Route::put('/employees/{id}/permissions', [AdminEmployeePermissionController::class, 'sync'])
                ->middleware('check.permission:manage_permissions');
        });

        Route::middleware('check.permission:manage_citizens')->group(function () {
            Route::get('/citizens', [AdminCitizenController::class, 'index']);
            Route::get('/citizens/{id}', [AdminCitizenController::class, 'show']);
            Route::patch('/citizens/{id}/toggle-status', [AdminCitizenController::class, 'toggleStatus']);
        });

        Route::get('/dashboard', [AdminDashboardController::class, 'index'])
            ->middleware('check.permission:view_statistics');

        Route::get('/stats', [AdminStatsController::class, 'index'])
            ->middleware('check.permission:view_statistics');

        Route::get('/verification-logs', [AdminVerificationLogController::class, 'index'])
            ->middleware('check.permission:view_verification_logs');

        Route::get('/ocr-logs', [AdminOcrController::class, 'index'])
            ->middleware('check.permission:view_ocr_logs');

        Route::get('/audit-logs', [AdminAuditLogController::class, 'index'])
            ->middleware('check.permission:view_audit_logs');
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

    /*
    |----------------------------------------------------------------------
    | Notifications
    |----------------------------------------------------------------------
    */
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::patch('/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::post('/read-all', [NotificationController::class, 'markAllAsRead']);
    });
});

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/attachments/{id}/view', [AttachmentController::class, 'view'])
    ->name('attachments.view')
    ->middleware('signed');
