<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
            'is_sent'  => 'boolean',
            'sent_at'  => 'datetime',
        ];
    }

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function request(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Request::class, 'request_id', 'request_id');
    }
}
