<?php

namespace App\Services;

class IdentityVerificationService
{
    /**
     * حساب نسبة المطابقة بين مدخلات المواطن ومخرجات الذكاء الاصطناعي (OCR)
     *
     * * @param mixed $citizen كائن المواطن (يحتوي على علاقة user)
     * @param  mixed  $ocr  كائن النتيجة المستخرجة من محرك بايثون
     * @return int نسبة المطابقة (من 0 إلى 100)
     */
    public function calculateScore($citizen, $ocr): int
    {
        $score = 0;

        // 1. مطابقة الاسم الأول
        if (isset($ocr->first_name) && $citizen->user->first_name === $ocr->first_name) {
            $score += 25;
        }

        // 2. مطابقة الكنية (النسبة)
        if (isset($ocr->last_name) && $citizen->user->last_name === $ocr->last_name) {
            $score += 25;
        }

        // 3. مطابقة اسم الأب
        if (isset($ocr->father_name) && $citizen->father_name === $ocr->father_name) {
            $score += 25;
        }

        // 4. مطابقة الرقم الوطني (الأهم أمنياً)
        if (isset($ocr->national_number) && $citizen->user->national_id === $ocr->national_number) {
            $score += 25;
        }

        return $score;
    }
}
