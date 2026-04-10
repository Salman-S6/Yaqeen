<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Attachment extends Model
{
    protected $fillable = [
        'request_id',
        'file_path',
        'file_type',
        'file_size_kb',
        'uploaded_at',
    ];

    protected function casts(): array
    {
        return [
            'uploaded_at' => 'datetime',
        ];
    }

    public function request(): BelongsTo
    {
        return $this->belongsTo(Request::class);
    }

    public function ocrResult(): HasOne
    {
        return $this->hasOne(OCRResult::class);
    }

    public function fraudCheck(): HasOne
    {
        return $this->hasOne(FraudCheck::class);
    }
}
