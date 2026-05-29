<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminAuditLogResource;
use App\Models\AuditLog;

class AdminAuditLogController extends Controller
{
    public function index()
    {
        $logs = AuditLog::with('user')->latest()->paginate(15);

        return response()->json([
            'status' => 'success',
            'data' => AdminAuditLogResource::collection($logs)->response()->getData(true),
        ]);
    }
}
