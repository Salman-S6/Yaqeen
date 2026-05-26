<?php

namespace App\Services;

use App\Models\Request;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class RequestService
{
    public function __construct(
        protected NotificationService $notificationService,
        protected AutoAssignService $autoAssignService,
        protected SignatureService $signatureService
    ) {}

    public function getAll(User $user, array $filters = []): LengthAwarePaginator
    {
        $query = Request::with(['citizen.user', 'serviceType', 'assignedEmployee'])->latest();

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

    /**
     * إنشاء الطلب ثم تعيينه تلقائياً للموظف الأقل عبئاً
     */
    public function create(array $data, User $user): Request
    {
        $citizen = $user->citizen;

        if (! $citizen) {
            throw new \Exception('لا يوجد ملف مواطن مرتبط بهذا الحساب.');
        }

        return DB::transaction(function () use ($data, $citizen) {

            $request = Request::create([
                'request_number' => $this->generateRequestNumber(),
                'citizen_id' => $citizen->id,
                'service_type_id' => $data['service_type_id'],
                'status' => 'pending',
                'submitted_at' => now(),
            ]);

            // تعيين تلقائي للموظف الأقل عبئاً فور إنشاء الطلب
            $this->autoAssignService->assign($request);

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
            ])->findOrFail($requestId);

            // 1. تحديث حالة الطلب
            $request->update([
                'status' => 'approved',
                'resolved_at' => now(),
            ]);

            // 2. إنشاء الوثيقة (SD-09: 3.1.2 INSERT INTO documents)
            $document = $request->document()->create([
                'issued_by' => Auth::id(), // الموظف الذي أصدر الوثيقة
                'generated_at' => now(),
            ]);

            // 3. تجهيز البيانات المراد توقيعها (Payload)
            $user = $request->citizen->user;

            $payloadData = [
                'document_id' => $document->id,
                'request_number' => $request->request_number,
                'citizen_name' => $user->full_name,
                'national_id' => $user->national_id,
                'service' => $request->serviceType->name,
                'issued_at' => $document->generated_at->toIso8601String(),
            ];

            // 4. توليد التوقيع الرقمي (SD-09: 3.1.5 signJSON)
            $signature = $this->signatureService->sign($payloadData);

            // إضافة التوقيع إلى الـ Payload ليكون جاهزاً للـ QR
            $finalPayload = [
                'data' => $payloadData,
                'signature' => $signature,
            ];

            $jsonPayload = json_encode($finalPayload);

            // 5. حفظ الـ QR Code في قاعدة البيانات (SD-09: 3.1.6 INSERT INTO qr_codes)
            $document->qrCode()->create([
                'payload' => $jsonPayload,
                'generated_at' => now(),
            ]);

            // (اختياري) توليد صورة الـ QR Code وحفظها في التخزين لاستخدامها في واجهة المستخدم
            // $qrImage = QrCode::format('png')->size(300)->generate($jsonPayload);
            // Storage::disk('local')->put('qr_codes/' . $document->id . '.png', $qrImage);

            // 6. إرسال إشعار القبول (SD-09: 3.1.7)
            $this->notificationService->sendApproval($request);

            // 7. (SD-09: 3.1.8 INSERT INTO audit_log)
            // سيتم إضافتها لاحقاً إذا كان لديكم AuditLogService

            return $request;
        });
    }

    public function reject(int $requestId, string $reason, User $employee): Request
    {
        return DB::transaction(function () use ($requestId, $reason, $employee) {

            $request = Request::with([
                'citizen.user',
                'serviceType',
                'assignedEmployee',
            ])->findOrFail($requestId);

            $request->update([
                'status' => 'rejected',
                'resolved_at' => now(),
            ]);

            // تسجيل سبب الرفض في جدول منفصل
            $request->rejectionReason()->create([
                'employee_id' => $employee->id,
                'reason' => $reason,
            ]);

            // إرسال إشعار البريد للمواطن مع السبب بشكل Async
            $this->notificationService->sendRejection($request, $reason);

            return $request->load(['citizen.user', 'serviceType', 'assignedEmployee', 'rejectionReason']);
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
        ]);

        // المواطن لا يستطيع رؤية طلبات غيره
        if ($user->hasRole('citizen')) {
            $query->where('citizen_id', $user->citizen?->id);
        }

        return $query->findOrFail($id);
    }

    private function generateRequestNumber(): string
    {
        $today = now()->format('Ymd');

        $count = Request::whereDate('created_at', today())->count() + 1;

        return 'REQ-'.$today.'-'.str_pad($count, 4, '0', STR_PAD_LEFT);
    }
}
