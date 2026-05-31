<?php

namespace App\Http\Controllers\Api\Dashboards\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminCitizenResource;
use App\Models\Citizen;

class AdminCitizenController extends Controller
{
    public function index()
    {
        $citizens = Citizen::with('user')->latest()->paginate(15);

        return response()->json([
            'status' => 'success',
            'data' => AdminCitizenResource::collection($citizens)->response()->getData(true),
        ]);
    }

    public function show($id)
    {
        $citizen = Citizen::with(['user', 'attachments'])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => new AdminCitizenResource($citizen),
        ]);
    }

    public function toggleStatus($id)
    {
        $citizen = Citizen::with('user')->findOrFail($id);
        $user = $citizen->user;

        $newStatus = $user->status === 'suspended' ? 'active' : 'suspended';

        $user->update(['status' => $newStatus]);

        $message = $newStatus === 'suspended'
            ? 'تم إيقاف حساب المواطن بنجاح. لن يتمكن من تسجيل الدخول.'
            : 'تم إعادة تفعيل حساب المواطن بنجاح.';

        return response()->json([
            'status' => 'success',
            'message' => $message,
            'account_status' => $newStatus,
        ]);
    }
}
