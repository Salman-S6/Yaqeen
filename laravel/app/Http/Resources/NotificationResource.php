<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'subject' => $this->subject,
            'message' => $this->message,
            'request_number' => $this->request?->request_number,
            'is_read' => $this->read_at !== null,

            'read_at' => $this->read_at ? $this->read_at->toISOString() : null,
            'sent_at' => $this->sent_at ? $this->sent_at->toISOString() : null,
            'created_at' => $this->created_at ? $this->created_at->toISOString() : null,
        ];
    }
}
