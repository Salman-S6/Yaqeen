<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AdminAuditLogResource extends JsonResource
{
    public function toArray($request)
    {
        $actions = [
            'created' => 'إضافة جديدة',
            'updated' => 'تعديل بيانات',
            'deleted' => 'حذف سجل',
        ];

        $entities = [
            'Request' => 'طلب خدمة',
            'User' => 'مستخدم/موظف',
            'Citizen' => 'مواطن',
            'ServiceType' => 'نوع خدمة',
        ];

        return [
            'id' => $this->id,
            'user_name' => $this->user ? trim($this->user->first_name . ' ' . $this->user->last_name) : 'النظام / زائر',
            'action' => $actions[$this->action] ?? $this->action,
            'entity' => $entities[$this->entity_type] ?? $this->entity_type,
            'entity_id' => $this->entity_id,
            'changes' => [
                'old' => $this->old_value,
                'new' => $this->new_value,
            ],
            'ip_address' => $this->ip_address ?? 'غير متوفر',
            'date' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
