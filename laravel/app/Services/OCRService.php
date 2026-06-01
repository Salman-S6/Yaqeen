<?php

namespace App\Services;

use App\Models\OCRResult;
use Exception;
use Illuminate\Http\UploadedFile;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;

class OCRService
{
    public function process(UploadedFile $file): array
    {
        $fullImagePath = $file->getRealPath();

        if (! file_exists($fullImagePath)) {
            throw new Exception('الملف المؤقت غير موجود للتحقق.');
        }

        $pythonBin = env('PYTHON_BINARY', 'python3');
        $pythonScriptPath = env('OCR_SCRIPT_PATH', base_path('../python_ocr/ocr.py'));

        $env = [
            'PATH' => getenv('PATH'),
        ];

        if (PHP_OS_FAMILY === 'Windows') {
            $env['SystemRoot'] = getenv('SystemRoot') ?: 'C:\\Windows';
            $pythonBin = env('PYTHON_BINARY', 'python');
        }

        $process = new Process(
            [$pythonBin, $pythonScriptPath, $fullImagePath],
            null,
            $env
        );

        $process->setTimeout(60);
        $process->run();

        if (! $process->isSuccessful()) {
            throw new ProcessFailedException($process);
        }

        $output = $process->getOutput();

        $ocrResponse = json_decode($output, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('فشل في تحليل المخرجات من محرك الذكاء الاصطناعي. المخرج: '.$output);
        }

        if (isset($ocrResponse['status']) && $ocrResponse['status'] === 'error') {
            throw new Exception('خطأ من محرك البايثون: '.$ocrResponse['message']);
        }

        return $ocrResponse;
    }

    public function saveResult(int $attachmentId, array $ocrResponse, float $matchScore = 0): OCRResult
    {
        $citizenData = $ocrResponse['data'] ?? [];

        $confidence = isset($ocrResponse['confidence_score']) && $ocrResponse['confidence_score'] > 0
                    ? $ocrResponse['confidence_score']
                    : $matchScore;

        return OCRResult::create([
            'attachment_id' => $attachmentId,
            'extracted_first_name' => $citizenData['first_name'] ?? 'غير مقروء',
            'extracted_last_name' => $citizenData['last_name'] ?? 'غير مقروء',
            'extracted_father_name' => $citizenData['father_name'] ?? null,
            'extracted_mother_first_name' => $citizenData['mother_name'] ?? null,
            'extracted_mother_last_name' => null,
            'extracted_national_id' => $citizenData['national_number'] ?? 'غير مقروء',
            'extracted_place' => $citizenData['birth_place_and_date'] ?? null,
            'extracted_dob' => null,

            'confidence_score' => $confidence,
            'engine_used' => $ocrResponse['engine_used'] ?? 'Gemini 2.5 Flash',
            'processed_at' => now(),
        ]);
    }

    public function getResultByAttachmentId(int $attachmentId): ?OCRResult
    {
        return OCRResult::where('attachment_id', $attachmentId)->first();
    }
}
