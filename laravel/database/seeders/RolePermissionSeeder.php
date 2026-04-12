<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // 🧹 تنظيف الكاش (مهم جداً)
    app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 🟢 1. إنشاء Permissions
        $permissions = [

            // Users
            'view users',
            'create users',
            'edit users',
            'delete users',

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

            //service types
            'view service types',
            'create service types',
            'update service types',
            'delete service types',


            // System
            'view audit logs',
        ];

       
           foreach ($permissions as $permission) {
        Permission::create([
            'name' => $permission,
            'guard_name' => 'api' //  مهم
        ]);
    }

        // 🟡 2. إنشاء Roles

    $admin=Role::create([
        'name' => 'admin',
        'guard_name' => 'api'
    ]);

     $employee=Role::create([
        'name' => 'employee',
        'guard_name' => 'api'
    ]);

    $citizen=Role::create([
        'name' => 'citizen',
        'guard_name' => 'api'
    ]);


        // 🔴 3. إعطاء صلاحيات

        // Admin → كل شيء
        $admin->givePermissionTo(Permission::all());

        // Employee → إدارة الطلبات فقط
        $employee->givePermissionTo([
            'view requests',
            'assign requests',
            'process requests',
            'approve requests',
            'reject requests',
            'view users',
            'view service types',
        ]);

        // Citizen → استخدام النظام فقط
        $citizen->givePermissionTo([
            'create requests',
            'view requests',
            'upload attachments',
            'view service types',
        ]);
    }
}