<?php

namespace App\Traits;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;

trait Auditable
{
    public static function bootAuditable()
    {
        static::created(function ($model) {
            self::logAuditAction($model, 'created');
        });

        static::updated(function ($model) {
            self::logAuditAction($model, 'updated');
        });

        static::deleted(function ($model) {
            self::logAuditAction($model, 'deleted');
        });
    }

    protected static function logAuditAction($model, $action)
    {
        $oldValue = $action !== 'created' ? $model->getOriginal() : null;
        $newValue = $action !== 'deleted' ? ($action === 'created' ? $model->getAttributes() : $model->getChanges()) : null;

        if (isset($oldValue['password'])) {
            unset($oldValue['password']);
        }
        if (isset($newValue['password'])) {
            unset($newValue['password']);
        }

        $userId = Auth::id() ?? ($model->getTable() === 'users' ? $model->id : null);

        AuditLog::create([
            'user_id' => $userId,
            'action' => $action,
            'entity_type' => class_basename($model),
            'entity_id' => $model->getKey(),
            'old_value' => $oldValue,
            'new_value' => $newValue,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
