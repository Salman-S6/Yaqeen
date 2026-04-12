<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Request extends Model
{
    protected $fillable = [
        'citizen_id',
        'request_number',
        'service_type_id',
        'assigned_employee_id',
        'status',
        'matching_score',
        'submitted_at',
        'assigned_at',
        'resolved_at',
    ];

    protected function casts(): array
    {
        return [
            'submitted_at' => 'datetime',
            'assigned_at' => 'datetime',
            'resolved_at' => 'datetime',
        ];
    }

    public function citizen(): BelongsTo
    {
        return $this->belongsTo(Citizen::class);
    }

    public function serviceType(): BelongsTo
    {
        return $this->belongsTo(ServiceType::class, 'service_type_id');
    }

    public function assignedEmployee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_employee_id', 'id');
    }

    public function attachments(): MorphMany
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }

    public function document(): HasOne
    {
        return $this->hasOne(Document::class);
    }

    public function dataMatching(): HasOne
    {
        return $this->hasOne(DataMatching::class);
    }

    public function rejectionReason(): HasOne
    {
        return $this->hasOne(RejectionReason::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    protected static function booted(): void
    {
        static::deleting(function ($request) {
            // عندما يتم حذف الطلب، قم بالمرور على كل مرفقاته وحذفها
            $request->attachments->each->delete();
        });
    }
}
