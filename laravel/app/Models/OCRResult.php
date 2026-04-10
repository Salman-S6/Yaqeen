<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OCRResult extends Model
{
    protected $fillable = [
        'attachment_id',
        'extracted_first_name',
        'extracted_last_name',
        'extracted_father_name',
        'extracted_mother_first_name',
        'extracted_mother_last_name',
        'extracted_national_id',
        'extracted_dob',
        'extracted_place',
        'confidence_score',
        'engine_used',
        'processed_at',
    ];

    protected function casts(): array
    {
        return [
            'extracted_dob' => 'date',
            'processed_at' => 'datetime',
        ];
    }

    public function attachment(): BelongsTo
    {
        return $this->belongsTo(Attachment::class);
    }
}
