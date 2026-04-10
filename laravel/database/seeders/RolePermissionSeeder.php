<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [

            // Users
            'view users',
            'create users',
            'edit users',
            'delete users',

            // Employees
            'manage employees',

            // Requests
            'view requests',
            'create requests',
            'assign requests',
            'process requests',
            'approve requests',
            'reject requests',

            // Roles & Permissions
            'manage roles',
            'manage permissions',

            // Attachments
            'upload attachments',
            'view attachments',

            // System
            'view audit logs',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'api',
            ]);
        }

        $admin = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'api',
        ]);

        $employee = Role::firstOrCreate([
            'name' => 'employee',
            'guard_name' => 'api',
        ]);

        $citizen = Role::firstOrCreate([
            'name' => 'citizen',
            'guard_name' => 'api',
        ]);

        $admin->givePermissionTo(Permission::all());

        $employee->givePermissionTo([
            'view requests',
            'assign requests',
            'process requests',
            'approve requests',
            'reject requests',
            'view users',
        ]);

        $citizen->givePermissionTo([
            'create requests',
            'view requests',
            'upload attachments',
        ]);

        $adminUser = User::firstOrCreate(
            [
                'first_name' => 'admin',
                'last_name' => 'admin',
                'national_id' => '00000000000',
                'email' => 'admin@test.sy',
                'password' => Hash::make('12345678'),
                'status' => 'active',
            ]
        );

        $adminUser->assignRole($admin);
    }
}
