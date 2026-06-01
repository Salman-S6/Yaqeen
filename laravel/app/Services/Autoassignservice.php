<?php

namespace App\Services;

use App\Models\User;

class AutoAssignService
{
    public function getAvailableEmployee(): ?User
    {
        return User::role('employee')
            ->where('status', 'active')
            ->withCount([
                'assignedRequests as active_requests_count' => function ($query) {
                    $query->whereIn('status', ['pending']);
                },
            ])
            ->orderBy('active_requests_count', 'asc')
            ->orderBy('id', 'asc')
            ->first();
    }
}
