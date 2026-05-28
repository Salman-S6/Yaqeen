<?php

namespace App\Services;

use App\Models\Attachment;
use App\Models\OCRResult; // 🌟 استدعاء مودل النتائج
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Exception;

class OCRService
{
    /**
     * 1. عملية المعالجة (التخاطب مع بايثون) - كما هي بدون تغيير
     */
    public function process(UploadedFile $file)
    {
        $fullImagePath = $file->getRealPath();

        if (!file_exists($fullImagePath)) {
            throw new Exception("الملف المؤقت غير موجود للتحقق.");
        }

        $pythonScriptPath = base_path('../python_ocr/ocr.py');

        $env = [
            'SystemRoot' => getenv('SystemRoot') ?: 'C:\Windows',
            'PATH' => getenv('PATH'),
        ];

        $process = new Process(
            ['python', $pythonScriptPath, $fullImagePath],
            null,
            $env
        );

        $process->setTimeout(60);
        $process->run();

        if (!$process->isSuccessful()) {
            throw new ProcessFailedException($process);
        }

        $output = $process->getOutput();
        $ocrData = json_decode($output);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("فشل في تحليل المخرجات من محرك الذكاء الاصطناعي. المخرج: " . $output);
        }

        if (isset($ocrData->status) && $ocrData->status === 'error') {
            throw new Exception("خطأ من محرك البايثون: " . $ocrData->message);
        }

        return $ocrData;
    }

    /**
     * 🌟 2. عملية الكتابة (Save / Write)
     * تقوم بتخزين نتيجة الـ OCR في قاعدة البيانات
     */
    public function saveResult(int $attachmentId, $ocrData, float $confidenceScore): OCRResult
    {
        return OCRResult::create([
            'attachment_id'               => $attachmentId,
            'extracted_first_name'        => $ocrData->first_name ?? 'غير مقروء',
            'extracted_last_name'         => $ocrData->last_name ?? 'غير مقروء',
            'extracted_father_name'       => $ocrData->father_name ?? null,
            'extracted_mother_first_name' => $ocrData->mother_name ?? null,
            'extracted_mother_last_name'  => null,
            'extracted_national_id'       => $ocrData->national_number ?? 'غير مقروء',
            'extracted_place'             => $ocrData->birth_place_and_date ?? null,
            'extracted_dob'               => null,
            'confidence_score'            => $confidenceScore,
            'engine_used'                 => 'Gemini 2.5 Flash',
            'processed_at'                => now(),
        ]);
    }

    /**
     * 🌟 3. عملية القراءة (Read / Get)
     * تقوم بجلب نتيجة الـ OCR بناءً على رقم المرفق
     */
    public function getResultByAttachmentId(int $attachmentId): ?OCRResult
    {
        return OCRResult::where('attachment_id', $attachmentId)->first();
    }
}
    