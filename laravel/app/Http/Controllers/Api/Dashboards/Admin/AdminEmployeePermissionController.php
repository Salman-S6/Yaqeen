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
        'manage_employees' => 'إدارة حسابات الموظفين',
        'manage_citizens' => 'إدارة حسابات المواطنين',
        'manage_permissions' => 'تعديل صلاحيات الموظفين',

        'view_requests' => 'عرض ومتابعة الطلبات',
        'create_requests' => 'إنشاء طلبات جديدة',
        'approve_requests' => 'الموافقة على الطلبات',
        'reject_requests' => 'رفض الطلبات',

        'upload_attachments' => 'رفع المرفقات',

        'view_service_types' => 'عرض أنواع الخدمات',
        'create_service_types' => 'إضافة خدمات جديدة',
        'update_service_types' => 'تعديل الخدمات',
        'delete_service_types' => 'حذف الخدمات',

        'view_statistics' => 'عرض الإحصائيات العامة',
        'view_audit_logs' => 'مراقبة سجلات النظام (Audit)',
        'view_ocr_logs' => 'مراقبة سجلات الذكاء الاصطناعي (OCR)',
        'view_verification_logs' => 'مراقبة سجلات التحقق الخارجي',
    ];

    public function show(int $id)
    {
        $employee = User::role('employee')->findOrFail($id);

        $allPermissions = Permission::all();
        $employeePermissions = $employee->getAllPermissions()->pluck('name')->toArray();

        $groupedPermissions = [
            'إدارة الطلبات والخدمات' => $this->mapPermissions($allPermissions, ['requests', 'service_types', 'attachments'], $employeePermissions),
            'إدارة المستخدمين' => $this->mapPermissions($allPermissions, ['employees', 'citizens', 'permissions'], $employeePermissions),
            'النظام والرقابة' => $this->mapPermissions($allPermissions, ['statistics', 'audit_logs', 'ocr_logs', 'verification_logs'], $employeePermissions),
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

    public function sync(Request $request, int $id)
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
