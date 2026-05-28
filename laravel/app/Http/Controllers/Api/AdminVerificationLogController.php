<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VerificationLog;
use App\Http\Resources\AdminVerificationLogResource;
use Illuminate\Http\Request;

class AdminVerificationLogController extends Controller
{
    public function index(Request $request)
    {
        $logs = VerificationLog::with('document.request')
            ->orderBy('verified_at', 'desc')
            ->paginate(15);

        return response()->json([
            'status' => 'success',
            'data' => AdminVerificationLogResource::collection($logs)->response()->getData(true)
        ]);
    }
}
