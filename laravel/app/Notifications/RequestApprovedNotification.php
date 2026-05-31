<?php

namespace App\Notifications;

use App\Mail\RequestApprovedMail;
use App\Models\Notification as NotificationRecord;
use App\Models\Request;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class RequestApprovedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $backoff = 60;

    public function __construct(
        public readonly Request $request,
        public readonly int $notificationRecordId,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): RequestApprovedMail
    {
        return new RequestApprovedMail($this->request);
    }

    public function withDelay(mixed $notifiable): array
    {
        return ['mail' => 0];
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

        Log::critical(
            'RequestApprovedNotification: فشل الإرسال نهائياً بعد كل المحاولات',
            [
                'notification_record_id' => $this->notificationRecordId,
                'request_id' => $this->request->id,
                'request_number' => $this->request->request_number,
                'error' => $exception->getMessage(),
            ]
        );
    }
}
