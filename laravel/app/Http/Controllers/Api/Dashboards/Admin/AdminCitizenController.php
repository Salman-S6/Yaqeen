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

        return AdminCitizenResource::collection($citizens)
            ->additional(['status' => 'success']);
    }

    public function show(int $id)
    {
        $citizen = Citizen::with(['user', 'attachments'])->findOrFail($id);

        return (new AdminCitizenResource($citizen))
            ->additional(['status' => 'success']);
    }

    public function toggleStatus(int $id)
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
