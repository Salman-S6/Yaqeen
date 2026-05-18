<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    protected $fillable = [
        'user_id',
        'request_id',
        'type',
        'subject',
        'message',
        'email_to',
        'is_sent',
        'retry_count',
        'sent_at',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'is_sent' => 'boolean',
            'sent_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function request(): BelongsTo
    {
        return $this->belongsTo(Request::class);
    }
}
