<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Citizen extends Model
{
    protected $fillable = [
        'user_id',
        'full_name',
        'father_name',
        'mother_first_name',
        'mother_last_name',
        'date_of_birth',
        'place_of_registration',
        'is_verified',
        'verified_at',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'is_verified'   => 'boolean',
            'verified_at'   => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function requests(): HasMany
    {
        return $this->hasMany(Request::class, 'citizen_id', 'citizen_id');
    }
}
