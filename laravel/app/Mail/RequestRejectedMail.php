<?php

namespace App\Mail;

use App\Models\Request;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RequestRejectedMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $citizenName;
    public string $requestNumber;
    public string $serviceName;
    public string $resolvedAt;
    public string $appUrl;

    public function __construct(
        public readonly Request $request,
        public readonly string  $reason,
    ) {
        $user = $request->citizen->user;

        $this->citizenName   = $user->first_name . ' ' . $user->last_name;
        $this->requestNumber = $request->request_number;
        $this->serviceName   = $request->serviceType?->name ?? '—';
        $this->resolvedAt    = $request->resolved_at
            ? $request->resolved_at->format('Y/m/d — H:i')
            : now()->format('Y/m/d — H:i');
        $this->appUrl        = config('app.url');
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'تم رفض طلبك — ' . $this->requestNumber,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.request.rejected',
            with: [
                'citizenName'   => $this->citizenName,
                'requestNumber' => $this->requestNumber,
                'serviceName'   => $this->serviceName,
                'resolvedAt'    => $this->resolvedAt,
                'reason'        => $this->reason,
                'appUrl'        => $this->appUrl,
            ],
        );
    }
}
