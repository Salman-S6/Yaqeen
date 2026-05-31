<?php

namespace App\Services;

use App\Models\Notification as NotificationRecord;
use App\Models\Request;
use App\Notifications\RequestApprovedNotification;
use App\Notifications\RequestReceivedNotification;
use App\Notifications\RequestRejectedNotification;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    public function sendReceived(Request $request): void
    {
        $this->dispatch(
            request: $request,
            type: 'received',
            subject: 'تم استلام طلبك — '.$request->request_number,
            message: 'تم استلام طلبك وتسجيله في النظام بنجاح وسيتم مراجعته قريباً.',
            callback: fn (NotificationRecord $record, $user) => $user->notify(new RequestReceivedNotification($request, $record->id)),
        );
    }

    public function sendApproval(Request $request): void
    {
        $this->dispatch(
            request: $request,
            type: 'accepted',
            subject: 'تمت الموافقة على طلبك — '.$request->request_number,
            message: 'تمت الموافقة على طلبك. يمكنك الآن تصدير وثيقتك من التطبيق.',
            callback: fn (NotificationRecord $record, $user) => $user->notify(new RequestApprovedNotification($request, $record->id)),
        );
    }

    public function sendRejection(Request $request, string $reason): void
    {
        $this->dispatch(
            request: $request,
            type: 'rejected',
            subject: 'تم رفض طلبك — '.$request->request_number,
            message: 'تم رفض طلبك. السبب: '.$reason,
            callback: fn (NotificationRecord $record, $user) => $user->notify(new RequestRejectedNotification($request, $reason, $record->id)),
        );
    }

    // -------------------------------------------------------------------------
    // Private Helpers
    // -------------------------------------------------------------------------

    private function dispatch(
        Request $request,
        string $type,
        string $subject,
        string $message,
        \Closure $callback,
    ): void {
        $user = $request->citizen?->user;

        if (! $user) {
            Log::warning('NotificationService: لا يوجد مستخدم مرتبط بالطلب — تم تخطي الإشعار', [
                'request_id' => $request->id,
                'request_number' => $request->request_number,
                'type' => $type,
            ]);

            return;
        }

        $record = NotificationRecord::create([
            'user_id' => $user->id,
            'request_id' => $request->id,
            'type' => $type,
            'subject' => $subject,
            'message' => $message,
            'email_to' => $user->email,
            'is_sent' => false,
            'retry_count' => 0,
        ]);

        try {
            $callback($record, $user);
        } catch (\Throwable $e) {
            Log::error('NotificationService: فشل دفع الإشعار للـ Queue', [
                'notification_id' => $record->id,
                'type' => $type,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
