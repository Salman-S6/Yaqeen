<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class EmployeeService
{
    public function create(array $data)
    {
        $user = User::create([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'national_id' => $data['national_id'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $role = Role::where('name', 'employee')
            ->where('guard_name', 'api')
            ->first();

        if (! $role) {
            throw new \Exception('Employee role not found');
        }

        $user->assignRole($role);

        return $user;
    }

    public function all()
    {
        return User::role('employee')->get();
    }

    public function find($id)
    {
        return User::findOrFail($id);
    }

    public function delete($id)
    {
        return User::destroy($id);
    }
}
