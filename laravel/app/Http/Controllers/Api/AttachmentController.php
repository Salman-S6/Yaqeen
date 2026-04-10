<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Attachment\StoreAttachmentRequest;
use App\Http\Resources\AttachmentResource;
use App\Models\Attachment;
use App\Services\AttachmentService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AttachmentController extends Controller
{
    protected AttachmentService $service;

    public function __construct(AttachmentService $service)
    {
        $this->service = $service;
    }

    // دالة لرفع المرفقات بشكل منفصل
    public function store(StoreAttachmentRequest $request)
    {
        $attachableClass = $request->attachable_type;

        // حماية أمنية: التأكد من أن الكلاس الممرر موجود فعلياً لمنع الاختراق
        if (! class_exists($attachableClass)) {
            return response()->json(['message' => 'نوع الكائن غير صالح'], 400);
        }

        $attachableModel = $attachableClass::findOrFail($request->attachable_id);

        try {
            $attachment = $this->service->store(
                $request->file('file'),
                $attachableModel,
                Auth::id(),
                $request->type
            );

            return new AttachmentResource($attachment);

        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 403);
        }
    }

    // دالة العرض الآمن للملف (يتم استدعاؤها عبر الرابط الموجود في الريسورس)
    public function view($id)
    {
        $attachment = Attachment::findOrFail($id);
        $user = Auth::user();

        // 1. التحقق من الصلاحيات (Authorization)
        // إذا كان المرفق تابعاً لـ Request، نتحقق مما إذا كان المستخدم هو صاحب الطلب، أو الموظف، أو مدير.
        if ($attachment->attachable_type === 'App\Models\Request') {
            $requestModel = $attachment->attachable;

            $isOwner = $requestModel->citizen->user_id === $user->id;
            $isAssignedEmployee = $requestModel->assigned_employee_id === $user->id;
            $isAdmin = $user->hasRole('admin');

            if (! $isOwner && (! $isAssignedEmployee && ! $isAdmin)) {
                return response()->json(['message' => 'غير مصرح لك بمشاهدة هذا المرفق'], 403);
            }
        }

        // 2. التحقق من وجود الملف في الـ Private Storage
        if (! Storage::disk($attachment->disk)->exists($attachment->path)) {
            return response()->json(['message' => 'الملف غير موجود على الخادم'], 404);
        }

        // 3. إرجاع الملف مباشرة للمتصفح أو التطبيق لعرضه
        $fullPath = storage_path('app/private/'.$attachment->path); // تأكد من المسار حسب إعدادات لارافل لديك

        return response()->file($fullPath, [
            'Content-Type' => $attachment->mime_type,
        ]);
    }
}
