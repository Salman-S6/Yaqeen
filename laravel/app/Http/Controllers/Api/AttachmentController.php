<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Attachment\StoreAttachmentRequest;
use App\Http\Resources\AttachmentResource;
use App\Models\Attachment;
use App\Models\Citizen;
use App\Models\Request;
use App\Services\AttachmentService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AttachmentController extends Controller
{
    public function __construct(protected AttachmentService $service) {}

    public function store(StoreAttachmentRequest $request)
    {
        // $attachableClass = $request->attachable_type;

        // if (! class_exists($attachableClass)) {
        //     return response()->json(['message' => 'نوع الكائن غير صالح'], 400);
        // }

        // $attachableModel = $attachableClass::findOrFail($request->attachable_id);

        $allowedTypes = [
            'citizen' => Citizen::class,
            'request' => Request::class,
        ];

        $type = $request->input('attachable_type');

        if (! array_key_exists($type, $allowedTypes)) {
            return response()->json(['message' => 'نوع غير مسموح'], 400);
        }

        $attachableModel = $allowedTypes[$type]::findOrFail($request->attachable_id);

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

        if (! Storage::disk($attachment->disk)->exists($attachment->path)) {
            return response()->json(['message' => 'الملف غير موجود على الخادم'], 404);
        }

        $fullPath = Storage::disk($attachment->disk)->path($attachment->path);

        return response()->file($fullPath, [
            'Content-Type' => $attachment->mime_type,
        ]);
    }
}
