<?php

namespace App\Services;

use App\Models\Attachment;
use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AttachmentService
{
    /**
     * @throws Exception
     */
    public function store(UploadedFile $file, $attachableModel, $uploaderId, $attachmentType = null)
    {
        $originalName = $file->getClientOriginalName();

        // 1. الحماية الصارمة: رفض الملفات التي تحتوي أكثر من نقطة واحدة
        if (substr_count($originalName, '.') > 1) {
            throw new Exception('الملف يحتوي على أكثر من لاحقة، وهذا غير مسموح لدواعٍ أمنية.', 403);
        }

        // 2. الحماية من ثغرات مسار المجلدات (Directory Traversal)
        if (str_contains($originalName, '..') || str_contains($originalName, '/') || str_contains($originalName, '\\')) {
            throw new Exception('اسم الملف يحتوي على رموز غير صالحة.', 403);
        }

        // 3. التحقق العميق من نوع الملف (MIME Type)
        $allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        $mimeType = $file->getClientMimeType();

        if (! in_array($mimeType, $allowedMimeTypes)) {
            throw new Exception('نوع الملف غير مدعوم. مسموح فقط برفع (JPG, PNG, PDF).', 403);
        }

        // 4. توليد اسم آمن ومستحيل التخمين
        $extension = $file->getClientOriginalExtension();
        $fileName = Str::uuid().'.'.$extension;

        // 5. التخزين الخاص (Private Storage)
        $disk = 'local';
        $folderPath = 'attachments/'.date('Y/m');
        $path = Storage::disk($disk)->putFileAs($folderPath, $file, $fileName);

        // 6. الحفظ في قاعدة البيانات بالبنية الجديدة (Polymorphic)
        return Attachment::create([
            'uploaded_by' => $uploaderId,
            'attachable_type' => get_class($attachableModel),
            'attachable_id' => $attachableModel->id,
            'type' => $attachmentType,
            'disk' => $disk,
            'path' => $path,
            'file_name' => $fileName,
            'original_name' => $originalName,
            'mime_type' => $mimeType,
            'file_size' => $file->getSize(),
        ]);
    }
}
