<?php

namespace App\Services;

class IdentityVerificationService
{
    public function calculateScore($citizen, $ocrData): int
    {
        $score = 0;

        $ocr = is_array($ocrData) ? $ocrData : (array) $ocrData;

        if (! empty($ocr['first_name'])) {
            $score += $this->calculateFlexibleMatch($citizen->user->first_name, $ocr['first_name'], 25);
        }

        if (! empty($ocr['last_name'])) {
            $score += $this->calculateFlexibleMatch($citizen->user->last_name, $ocr['last_name'], 25);
        }

        if (! empty($ocr['father_name'])) {
            $score += $this->calculateFlexibleMatch($citizen->father_name, $ocr['father_name'], 25);
        }

        if (! empty($ocr['national_number'])) {
            $citizenId = trim($citizen->user->national_id);
            $ocrId = trim($ocr['national_number']);

            if ($citizenId === $ocrId) {
                $score += 25;
            }
        }

        return (int) $score;
    }

    private function calculateFlexibleMatch($inputString, $ocrString, $maxScore): float
    {
        $str1 = $this->normalizeArabicText($inputString);
        $str2 = $this->normalizeArabicText($ocrString);

        if (empty($str1) || empty($str2)) {
            return 0;
        }

        $percent = 0;
        similar_text($str1, $str2, $percent);

        return ($percent / 100) * $maxScore;
    }

    private function normalizeArabicText($text): string
    {
        $text = trim($text);
        $text = preg_replace('/\s+/', ' ', $text);
        $text = str_replace(['أ', 'إ', 'آ'], 'ا', $text);
        $text = str_replace('ة', 'ه', $text);
        $text = str_replace('ى', 'ي', $text);

        return mb_strtolower($text, 'UTF-8');
    }
}
