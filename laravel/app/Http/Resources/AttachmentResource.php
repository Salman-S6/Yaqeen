<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AttachmentResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'original_name' => $this->original_name,
            'file_type' => $this->mime_type,
            'file_size_kb' => round($this->file_size / 1024, 2),

            'view_url' => route('attachments.view', $this->id),

            'uploaded_by' => new UserResource($this->uploader),
            'uploaded_at' => $this->created_at,
        ];
    }
}
