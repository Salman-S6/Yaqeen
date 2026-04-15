<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // 🚨 0. تفريغ الجداول بأمان
        // نوقف التحقق من المفاتيح الأجنبية لتجنب أخطاء الـ Foreign Key Constraint
        Schema::disableForeignKeyConstraints();

        // نفرغ الجداول الوسيطة والأساسية الخاصة بحزمة Spatie
        DB::table(config('permission.table_names.role_has_permissions'))->truncate();
        DB::table(config('permission.table_names.model_has_roles'))->truncate();
        DB::table(config('permission.table_names.model_has_permissions'))->truncate();
        Role::truncate();
        Permission::truncate();

        // نعيد تشغيل التحقق من المفاتيح الأجنبية
        Schema::enableForeignKeyConstraints();

        // 🧹 تنظيف الكاش (مهم جداً)
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

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

            // service types
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
                'guard_name' => 'api', //  مهم
            ]);
        }

        // 🟡 2. إنشاء Roles

        $admin = Role::create([
            'name' => 'admin',
            'guard_name' => 'api',
        ]);

        $employee = Role::create([
            'name' => 'employee',
            'guard_name' => 'api',
        ]);

        $citizen = Role::create([
            'name' => 'citizen',
            'guard_name' => 'api',
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
            'view attachments',
            'view service types',
        ]);
    }
}
