<?php

namespace App\Mail;

use App\Models\Request;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RequestReceivedMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $citizenName;

    public string $requestNumber;

    public string $serviceName;

    public string $submittedAt;

    public string $appUrl;

    public function __construct(public readonly Request $request)
    {
        $user = $request->citizen->user;

        $this->citizenName = $user->first_name.' '.$user->last_name;
        $this->requestNumber = $request->request_number;
        $this->serviceName = $request->serviceType?->name ?? '—';
        $this->submittedAt = $request->submitted_at
            ? $request->submitted_at->format('Y/m/d — H:i')
            : now()->format('Y/m/d — H:i');
        $this->appUrl = config('app.url');
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'تم استلام طلبك — '.$this->requestNumber,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.request.received',
            with: [
                'citizenName' => $this->citizenName,
                'requestNumber' => $this->requestNumber,
                'serviceName' => $this->serviceName,
                'submittedAt' => $this->submittedAt,
                'appUrl' => $this->appUrl,
            ],
        );
    }
}
