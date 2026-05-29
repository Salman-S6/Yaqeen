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
            'view_users',
            'create_users',
            'edit_users',
            'delete_users',
            'manage_employees',
            'manage_citizens',

            // Requests
            'view_requests',
            'create_requests',
            'process_requests',
            'approve_requests',
            'reject_requests',

            // Roles & Permissions
            'manage_roles',
            'manage_permissions',

            // Attachments
            'upload_attachments',
            'view_attachments',

            // service types
            'view_service_types',
            'create_service_types',
            'update_service_types',
            'delete_service_types',

            // System
            'view_audit_logs',
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
        // $employee->givePermissionTo([
        //     'view_requests',
        //     'assign_requests',
        //     'process_requests',
        //     'approve_requests',
        //     'reject_requests',
        //     'view_users',
        //     'view_service_types',
        // ]);

        // Citizen → استخدام النظام فقط
        $citizen->givePermissionTo([
            'create_requests',
            'view_requests',
            'upload_attachments',
            'view_attachments',
            'view_service_types',
        ]);
    }
}
