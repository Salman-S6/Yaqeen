<?php

namespace App\Services;

use App\Models\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class RequestService
{
    public function getAll()
    {
        return Request::with(['citizen.user', 'serviceType', 'employee'])
            ->latest()
            ->paginate(10);
    }

   public function create($data, $user)
{
    $citizen = $user->citizen;

    if (!$citizen) {
        throw new \Exception('Citizen not found for this user');
    }

    return \App\Models\Request::create([
        'request_number' => $this->generateRequestNumber(), 
        'citizen_id' => $citizen->id,
        'service_type_id' => $data['service_type_id'],
        'status' => 'pending',
        'submitted_at' => now(),
    ]);
}

    public function assign($requestId, $employeeId)
    {
        $request = Request::findOrFail($requestId);

        $request->update([
            'assigned_employee_id' => $employeeId,
            'assigned_at' => now(),
            'status' => 'under_review'
        ]);

        return $request;
    }

    public function changeStatus($requestId, $status)
    {
        $request = Request::findOrFail($requestId);

        $request->update([
            'status' => $status,
            'resolved_at' => now()
        ]);

        return $request;
    }

    public function findById($id)
    {
        return Request::with(['citizen.user', 'attachments'])->findOrFail($id);
    }

    //create number random

    private function generateRequestNumber(): string
{
    $today = now()->format('Ymd');

    $count = \App\Models\Request::whereDate('created_at', today())->count() + 1;

    return 'REQ-' . $today . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);
}

}