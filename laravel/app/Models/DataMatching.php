<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DataMatching extends Model
{
    protected $fillable = [
        'request_id',
        'match_percentage',
        'created_at',
    ];

    public function request(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Request::class, 'request_id', 'request_id');
    }
}
