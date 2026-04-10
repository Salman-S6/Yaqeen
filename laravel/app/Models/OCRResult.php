<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OCRResult extends Model
{
    protected $fillable = [
        'attachment_id',
        'extracted_name',
        'extracted_father_name',
        'extracted_mother_name',
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
            'processed_at'  => 'datetime',
        ];
    }

    public function attachment(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'attachment_id', 'attachment_id');
    }
}
