<?php

namespace App\Notifications;

use App\Mail\RequestApprovedMail;
use App\Models\Notification as NotificationRecord;
use App\Models\Request;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class RequestApprovedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * عدد محاولات الإرسال عند الفشل (UC-09 — retry 3 times)
     */
    public int $tries = 3;

    /**
     * وقت الانتظار بين المحاولات بالثواني
     */
    public int $backoff = 60;

    public function __construct(
        public readonly Request $request,
        public readonly int     $notificationRecordId,
    ) {}

    /**
     * القنوات المستخدمة — mail فقط   
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * بناء رسالة البريد الإلكتروني باستخدام RequestApprovedMail
     */
    public function toMail(object $notifiable): RequestApprovedMail
    {
        return new RequestApprovedMail($this->request);
    }

    /**
     * بعد نجاح الإرسال — تحديث سجل الإشعار في قاعدة البيانات
     */
    public function withDelay(mixed $notifiable): array
    {
        return ['mail' => 0];
    }

    /**
     * عند نجاح المهمة في الـ Queue — نحدّث is_sent
     */
    public function markAsSent(): void
    {
        NotificationRecord::where('id', $this->notificationRecordId)
            ->update([
                'is_sent' => true,
                'sent_at' => now(),
            ]);
    }

    /**
     * عند فشل جميع المحاولات — تسجيل في Log
     */
    public function failed(\Throwable $exception): void
    {
        NotificationRecord::where('id', $this->notificationRecordId)
            ->increment('retry_count');

        \Illuminate\Support\Facades\Log::critical(
            'RequestApprovedNotification: فشل الإرسال نهائياً بعد كل المحاولات',
            [
                'notification_record_id' => $this->notificationRecordId,
                'request_id'             => $this->request->id,
                'request_number'         => $this->request->request_number,
                'error'                  => $exception->getMessage(),
            ]
        );
    }
}
