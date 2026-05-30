<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Storage;

class Attachment extends Model
{
    protected $fillable = [
        'uploaded_by',
        'attachable_type',
        'attachable_id',
        'type',
        'disk',
        'path',
        'file_name',
        'original_name',
        'mime_type',
        'file_size',
    ];

    public function attachable(): MorphTo
    {
        return $this->morphTo();
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function ocrResult(): HasOne
    {
        return $this->hasOne(OCRResult::class);
    }

    protected static function booted(): void
    {
        static::deleting(function ($attachment) {
            if (Storage::disk($attachment->disk)->exists($attachment->path)) {
                Storage::disk($attachment->disk)->delete($attachment->path);
            }
        });
    }
}
