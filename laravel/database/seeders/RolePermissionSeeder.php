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
        Schema::disableForeignKeyConstraints();

        DB::table(config('permission.table_names.role_has_permissions'))->truncate();
        DB::table(config('permission.table_names.model_has_roles'))->truncate();
        DB::table(config('permission.table_names.model_has_permissions'))->truncate();
        Role::truncate();
        Permission::truncate();

        Schema::enableForeignKeyConstraints();

        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            // Users Management
            'manage_employees',
            'manage_citizens',
            'manage_permissions',

            // Requests Management
            'view_requests',
            'create_requests',
            'approve_requests',
            'reject_requests',

            // Attachments
            'upload_attachments',

            // Service Types
            'view_service_types',
            'create_service_types',
            'update_service_types',
            'delete_service_types',

            // System Logs & Analytics
            'view_statistics',
            'view_audit_logs',
            'view_ocr_logs',
            'view_verification_logs',
        ];

        foreach ($permissions as $permission) {
            Permission::create([
                'name' => $permission,
                'guard_name' => 'api',
            ]);
        }

        $admin = Role::create(['name' => 'admin', 'guard_name' => 'api']);
        $employee = Role::create(['name' => 'employee', 'guard_name' => 'api']);
        $citizen = Role::create(['name' => 'citizen', 'guard_name' => 'api']);

        $admin->givePermissionTo(Permission::all());

        $employee->givePermissionTo([
            'view_requests',
            'approve_requests',
            'reject_requests',
            'view_service_types',
        ]);

        $citizen->givePermissionTo([
            'create_requests',
            'view_requests',
            'upload_attachments',
            'view_service_types',
        ]);
    }
}
