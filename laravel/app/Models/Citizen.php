<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Citizen extends Model
{
    protected $fillable = [
        'user_id',
        'father_name',
        'mother_first_name',
        'mother_last_name',
        'date_of_birth',
        'place_of_registration',
        // 'is_verified',
        // 'verified_at',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            // 'is_verified' => 'boolean',
            // 'verified_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function requests(): HasMany
    {
        return $this->hasMany(Request::class);
    }

    public function attachments(): MorphMany
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }

    protected static function booted(): void
    {
        static::deleting(function ($citizen) {
            $citizen->attachments->each->delete();
        });
    }
}
