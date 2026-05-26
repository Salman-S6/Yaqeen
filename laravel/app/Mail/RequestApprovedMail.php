<?php

namespace App\Mail;

use App\Models\Request;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RequestApprovedMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $citizenName;
    public string $requestNumber;
    public string $serviceName;
    public string $resolvedAt;
    public string $employeeName;
    public string $appUrl;

    public function __construct(public readonly Request $request)
    {
        $user        = $request->citizen->user;
        $employee    = $request->assignedEmployee;

        $this->citizenName   = $user->first_name . ' ' . $user->last_name;
        $this->requestNumber = $request->request_number;
        $this->serviceName   = $request->serviceType?->name ?? '—';
        $this->resolvedAt    = $request->resolved_at
            ? $request->resolved_at->format('Y/m/d — H:i')
            : now()->format('Y/m/d — H:i');
        $this->employeeName  = $employee
            ? $employee->first_name . ' ' . $employee->last_name
            : 'الموظف المختص';
        $this->appUrl        = config('app.url');
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'تمت الموافقة على طلبك — ' . $this->requestNumber,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.request.approved',
            with: [
                'citizenName'   => $this->citizenName,
                'requestNumber' => $this->requestNumber,
                'serviceName'   => $this->serviceName,
                'resolvedAt'    => $this->resolvedAt,
                'employeeName'  => $this->employeeName,
                'appUrl'        => $this->appUrl,
            ],
        );
    }
}
