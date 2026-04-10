<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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

    public function request(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Request::class, 'request_id', 'request_id');
    }

    public function ocrResult(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(OCRResult::class, 'attachment_id', 'attachment_id');
    }

    public function fraudCheck(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(FraudCheck::class, 'attachment_id', 'attachment_id');
    }
}
