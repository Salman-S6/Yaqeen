<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Request extends Model
{
    protected $fillable = [
        'citizen_id',
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
            'assigned_at'  => 'datetime',
            'resolved_at'  => 'datetime',
        ];
    }

    public function citizen(): BelongsTo
    {
        return $this->belongsTo(Citizen::class, 'citizen_id', 'citizen_id');
    }

    public function serviceType(): BelongsTo
    {
        return $this->belongsTo(ServiceType::class, 'service_type_id', 'service_type_id');
    }

    public function assignedEmployee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_employee_id', 'user_id');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(Attachment::class, 'request_id', 'request_id');
    }

    public function document(): HasOne
    {
        return $this->hasOne(Document::class, 'request_id', 'request_id');
    }

    public function dataMatching(): HasOne
    {
        return $this->hasOne(DataMatching::class, 'request_id', 'request_id');
    }

    public function rejectionReason(): HasOne
    {
        return $this->hasOne(RejectionReason::class, 'request_id', 'request_id');
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'request_id', 'request_id');
    }
}
