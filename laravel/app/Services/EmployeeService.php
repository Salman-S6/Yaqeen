<?php
namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class EmployeeService
{
    public function create(array $data)
    {
        // 1️⃣ إنشاء المستخدم
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        // 2️⃣ إعطاء role = employee
        $role = Role::where('name', 'employee')
            ->where('guard_name', 'api')
            ->first();

        if (!$role) {
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