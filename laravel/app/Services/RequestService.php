<?php

namespace App\Services;

use App\Models\Request;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RequestService
{
    public function __construct(
        protected NotificationService $notificationService,
        protected AutoAssignService $autoAssignService,
        protected SignatureService $signatureService
    ) {}

    public function getAll(User $user, array $filters = []): LengthAwarePaginator
    {
        $query = Request::with(['citizen.user', 'serviceType', 'assignedEmployee', 'document.qrCode'])->latest();

        if ($user->hasRole('citizen')) {
            $query->where('citizen_id', $user->citizen?->id);
        } elseif ($user->hasRole('employee')) {
            $query->where('assigned_employee_id', $user->id);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->paginate(15);
    }

    public function create(array $data, User $user): Request
    {
        $citizen = $user->citizen;

        if (! $citizen) {
            throw new \Exception('لا يوجد ملف مواطن مرتبط بهذا الحساب.');
        }

        $duplicate = Request::where('citizen_id', $citizen->id)
            ->where('service_type_id', $data['service_type_id'])
            ->where('status', 'pending')
            ->exists();

        if ($duplicate) {
            throw ValidationException::withMessages([
                'service_type_id' => ['لديك طلب قيد الانتظار لنفس الخدمة. لا يمكن تقديم طلب مكرر.'],
            ]);
        }

        $employee = $this->autoAssignService->getAvailableEmployee();

        if (! $employee) {
            throw ValidationException::withMessages([
                'system' => ['نعتذر، لا يوجد موظفون متاحون حالياً لمعالجة الخدمات. يرجى المحاولة في وقت لاحق.'],
            ]);
        }

        return DB::transaction(function () use ($data, $citizen, $employee) {

            $request = Request::create([
                'request_number' => $this->generateRequestNumber(),
                'citizen_id' => $citizen->id,
                'service_type_id' => $data['service_type_id'],
                'status' => 'pending',
                'submitted_at' => now(),
                'assigned_employee_id' => $employee->id,
                'assigned_at' => now(),
            ]);

            $this->notificationService->sendReceived($request);

            return $request->load(['citizen.user', 'serviceType', 'assignedEmployee']);
        });
    }

    public function approve(int $requestId): Request
    {
        return DB::transaction(function () use ($requestId) {

            $request = Request::with([
                'citizen.user',
                'serviceType',
                'assignedEmployee',
            ])
                ->lockForUpdate()
                ->findOrFail($requestId);

            if ($request->assigned_employee_id !== Auth::id()) {
                throw ValidationException::withMessages([
                    'request' => ['غير مصرح لك باعتماد هذا الطلب لأنه مخصص لموظف آخر.'],
                ]);
            }

            if ($request->status !== 'pending') {
                throw ValidationException::withMessages([
                    'request' => ['لا يمكن اعتماد طلب تمت معالجته مسبقاً.'],
                ]);
            }

            if ($request->document()->exists()) {
                throw ValidationException::withMessages([
                    'request' => ['تم إصدار وثيقة لهذا الطلب مسبقاً.'],
                ]);
            }

            $request->update([
                'status' => 'approved',
                'resolved_at' => now(),
            ]);

            $document = $request->document()->create([
                'issued_by' => Auth::id(),
                'generated_at' => now(),
            ]);

            $user = $request->citizen->user;

            $payloadData = [
                'document_id' => $document->id,
                'request_number' => $request->request_number,
                'citizen_name' => $user->full_name,
                'national_id' => $user->national_id,
                'service' => $request->serviceType->name,
                'issued_at' => $document->generated_at->toIso8601String(),
            ];

            $base64Payload = base64_encode(
                json_encode($payloadData, JSON_UNESCAPED_UNICODE)
            );

            $signature = $this->signatureService->sign($base64Payload);

            $verifyUrl = $this->signatureService->generateVerifyUrl(
                $document->id,
                $base64Payload,
                $signature
            );

            $finalPayload = [
                'data' => $payloadData,
                'signature' => $signature,
                'verify_url' => $verifyUrl,
            ];

            $jsonPayload = json_encode($finalPayload, JSON_UNESCAPED_UNICODE);

            $document->qrCode()->create([
                'payload' => $jsonPayload,
                'generated_at' => now(),
            ]);

            $this->notificationService->sendApproval($request);

            return $request->load([
                'citizen.user',
                'serviceType',
                'assignedEmployee',
                'document.qrCode',
            ]);
        });
    }

    public function reject(int $requestId, string $reason, User $employee): Request
    {
        return DB::transaction(function () use ($requestId, $reason, $employee) {

            $request = Request::with([
                'citizen.user',
                'serviceType',
                'assignedEmployee',
            ])
                ->lockForUpdate()
                ->findOrFail($requestId);

            if ($request->assigned_employee_id !== $employee->id) {
                throw ValidationException::withMessages([
                    'request' => ['غير مصرح لك برفض هذا الطلب لأنه مخصص لموظف آخر.'],
                ]);
            }

            if ($request->status !== 'pending') {
                throw ValidationException::withMessages([
                    'request' => ['لا يمكن رفض طلب تمت معالجته مسبقاً.'],
                ]);
            }

            $request->update([
                'status' => 'rejected',
                'resolved_at' => now(),
            ]);

            $request->rejectionReason()->create([
                'employee_id' => $employee->id,
                'reason' => $reason,
            ]);

            $this->notificationService->sendRejection($request, $reason);

            return $request->load([
                'citizen.user',
                'serviceType',
                'assignedEmployee',
                'rejectionReason',
            ]);
        });
    }

    public function findById(int $id, User $user): Request
    {
        $query = Request::with([
            'citizen.user',
            'citizen.attachments',
            'serviceType',
            'assignedEmployee',
            'rejectionReason',
            'attachments',
            'document.qrCode',
        ]);

        if ($user->hasRole('citizen')) {
            $query->where('citizen_id', $user->citizen?->id);
        }

        return $query->findOrFail($id);
    }

    private function generateRequestNumber(): string
    {
        $today = now()->format('Ymd');
        $cacheKey = "request_sequence_{$today}";

        Cache::add($cacheKey, 0, now()->endOfDay());

        $count = Cache::increment($cacheKey);

        return 'REQ-'.$today.'-'.str_pad($count, 4, '0', STR_PAD_LEFT);
    }
}
