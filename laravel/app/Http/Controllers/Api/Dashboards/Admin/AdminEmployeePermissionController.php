<?php

namespace App\Http\Controllers\Api\Dashboards\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class AdminEmployeePermissionController extends Controller
{
    protected $permissionTranslations = [
        'view_users' => 'عرض المستخدمين',
        'create_users' => 'إضافة مستخدمين',
        'edit_users' => 'تعديل المستخدمين',
        'delete_users' => 'حذف المستخدمين',
        'manage_employees' => 'إدارة الموظفين',
        'manage_citizens' => 'إدارة المواطنين',
        'view_requests' => 'عرض الطلبات',
        'create_requests' => 'إنشاء الطلبات',
        'assign_requests' => 'إسناد الطلبات',
        'process_requests' => 'معالجة الطلبات',
        'approve_requests' => 'اعتماد الطلبات',
        'reject_requests' => 'رفض الطلبات',
        'manage_roles' => 'إدارة الأدوار',
        'manage_permissions' => 'إدارة الصلاحيات',
        'upload_attachments' => 'رفع المرفقات',
        'view_attachments' => 'عرض المرفقات',
        'view_service_types' => 'عرض أنواع الخدمات',
        'create_service_types' => 'إضافة أنواع خدمات',
        'update_service_types' => 'تعديل أنواع الخدمات',
        'delete_service_types' => 'حذف أنواع الخدمات',
        'view_audit_logs' => 'عرض سجلات النظام',
    ];

    public function show($id)
    {
        $employee = User::role('employee')->findOrFail($id);

        $allPermissions = Permission::all();
        $employeePermissions = $employee->getAllPermissions()->pluck('name')->toArray();

        $groupedPermissions = [
            'الطلبات والخدمات' => $this->mapPermissions($allPermissions, ['requests', 'service_types'], $employeePermissions),
            'إدارة المستخدمين' => $this->mapPermissions($allPermissions, ['users', 'employees', 'citizens'], $employeePermissions),
            'النظام والرقابة' => $this->mapPermissions($allPermissions, ['roles', 'permissions', 'audit_logs'], $employeePermissions),
            'المرفقات' => $this->mapPermissions($allPermissions, ['attachments'], $employeePermissions),
        ];

        return response()->json([
            'status' => 'success',
            'data' => [
                'employee' => [
                    'id' => $employee->id,
                    'name' => $employee->first_name.' '.$employee->last_name,
                ],
                'permissions_groups' => $groupedPermissions,
            ],
        ]);
    }

    public function sync(Request $request, $id)
    {
        $employee = User::role('employee')->findOrFail($id);

        $request->validate([
            'permissions' => 'present|array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        $employee->syncPermissions($request->permissions);

        app()->make(PermissionRegistrar::class)->forgetCachedPermissions();

        return response()->json([
            'status' => 'success',
            'message' => 'تم تحديث صلاحيات الموظف بنجاح.',
        ]);
    }

    private function mapPermissions($all, $keywords, $owned)
    {
        return $all->filter(function ($perm) use ($keywords) {
            foreach ($keywords as $keyword) {
                if (str_contains($perm->name, $keyword)) {
                    return true;
                }
            }

            return false;
        })->map(function ($perm) use ($owned) {
            return [
                'name' => $perm->name,
                'label' => $this->permissionTranslations[$perm->name] ?? $perm->name,
                'is_assigned' => in_array($perm->name, $owned),
            ];
        })->values();
    }
}
