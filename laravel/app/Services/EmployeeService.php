<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class EmployeeService
{
    public function create(array $data): User
    {
        return DB::transaction(function () use ($data) {

            $role = Role::where('name', 'employee')
                ->where('guard_name', 'api')
                ->firstOrFail();

            $user = User::create([
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'national_id' => $data['national_id'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'status' => $data['status'] ?? 'active',
            ]);

            $user->assignRole($role);

            $defaultPermissions = [
                'view_requests',
                'process_requests',
                'approve_requests',
                'reject_requests',
                'view_users',
                'view_service_types',
            ];
            $user->syncPermissions($defaultPermissions);

            return $user;
        });
    }

    public function update(User $user, array $data): User
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        return $user->fresh();
    }

    public function all()
    {
        return User::role('employee')->latest()->paginate(15);
    }

    public function find(int $id)
    {
        return User::role('employee')->findOrFail($id);
    }

    public function delete(int $id)
    {
        $user = $this->find($id);
        $user->delete();
    }
}
