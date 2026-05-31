<?php

namespace App\Services;

use App\Models\Attachment;
use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AttachmentService
{
    public function store(UploadedFile $file, $attachableModel, $uploaderId, $attachmentType = null)
    {
        $originalName = $file->getClientOriginalName();

        if (substr_count($originalName, '.') > 1) {
            throw new Exception('الملف يحتوي على أكثر من لاحقة، وهذا غير مسموح لدواعٍ أمنية.', 403);
        }

        if (str_contains($originalName, '..') || str_contains($originalName, '/') || str_contains($originalName, '\\')) {
            throw new Exception('اسم الملف يحتوي على رموز غير صالحة.', 403);
        }

        $allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        $mimeType = $file->getClientMimeType();

        if (! in_array($mimeType, $allowedMimeTypes)) {
            throw new Exception('نوع الملف غير مدعوم. مسموح فقط برفع (JPG, PNG, PDF).', 403);
        }

        $extension = $file->getClientOriginalExtension();
        $fileName = Str::uuid().'.'.$extension;

        $disk = 'local';
        $folderPath = 'attachments/'.date('Y/m');
        $path = Storage::disk($disk)->putFileAs($folderPath, $file, $fileName);

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
