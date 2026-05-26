<?php

namespace App\Notifications;

use App\Mail\RequestReceivedMail;
use App\Models\Notification as NotificationRecord;
use App\Models\Request;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class RequestReceivedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public int $tries   = 3;
    public int $backoff = 60;

    public function __construct(
        public readonly Request $request,
        public readonly int     $notificationRecordId,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): RequestReceivedMail
    {
        return new RequestReceivedMail($this->request);
    }

    public function markAsSent(): void
    {
        NotificationRecord::where('id', $this->notificationRecordId)
            ->update([
                'is_sent' => true,
                'sent_at' => now(),
            ]);
    }

    public function failed(\Throwable $exception): void
    {
        NotificationRecord::where('id', $this->notificationRecordId)
            ->increment('retry_count');

        \Illuminate\Support\Facades\Log::critical(
            'RequestReceivedNotification: فشل الإرسال نهائياً',
            [
                'notification_record_id' => $this->notificationRecordId,
                'request_id'             => $this->request->id,
                'error'                  => $exception->getMessage(),
            ]
        );
    }
}
