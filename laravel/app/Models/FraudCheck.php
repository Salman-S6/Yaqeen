<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FraudCheck extends Model
{
    protected $fillable = [
        'attachment_id',
        'result',
        'forgery_confidence',
        'processed_at',
    ];

    protected function casts(): array
    {
        return [
            'processed_at' => 'datetime',
        ];
    }

    public function attachment(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'attachment_id', 'attachment_id');
    }
}
