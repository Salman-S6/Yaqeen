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

    public function store(StoreAttachmentRequest $request)
    {
        $attachableClass = $request->attachable_type;

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

    public function view($id)
    {
        $attachment = Attachment::findOrFail($id);

        if (!Storage::disk($attachment->disk)->exists($attachment->path)) {
            return response()->json(['message' => 'الملف غير موجود على الخادم'], 404);
        }

        $fullPath = Storage::disk($attachment->disk)->path($attachment->path);

        return response()->file($fullPath, [
            'Content-Type' => $attachment->mime_type
        ]);
    }
}
