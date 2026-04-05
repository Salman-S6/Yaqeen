<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RejectionReason extends Model
{
    protected $fillable = [
        'request_id',
        'employee_id',
        'reason',
        'created_at',
    ];

    public function request(): BelongsTo
    {
        return $this->belongsTo(Request::class, 'request_id', 'request_id');
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'employee_id', 'user_id');
    }
}
