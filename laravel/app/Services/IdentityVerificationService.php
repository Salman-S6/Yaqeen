<?php

use App\Models\Attachment;
use App\Services\FraudService;
use App\Services\OCRService;

class IdentityVerificationService
{
    public function verify($citizen, $file)
    {
        $path = $file->store('ids');

        $attachment = Attachment::create([
            'request_id' => null,
            'file_path' => $path,
            'file_type' => $file->getClientMimeType(),
            'file_size_kb' => $file->getSize() / 1024,
            'uploaded_at' => now(),
        ]);

        $ocr = app(OCRService::class)->process($attachment);
        $fraud = app(FraudService::class)->check($attachment);

        $score = $this->match($citizen, $ocr);

        $citizen->update([
            'is_verified' => $score > 90 && $fraud->result === 'original',
            'verification_score' => $score,
            'verified_at' => now(),
        ]);

        return $citizen;
    }

    private function match($citizen, $ocr)
    {
        $score = 0;

        if ($citizen->user->first_name === $ocr->extracted_first_name) {
            $score += 25;
        }
        if ($citizen->user->last_name === $ocr->extracted_last_name) {
            $score += 25;
        }
        if ($citizen->father_name === $ocr->extracted_father_name) {
            $score += 25;
        }
        if ($citizen->date_of_birth == $ocr->extracted_dob) {
            $score += 25;
        }

        return $score;
    }
}
