<?php

namespace App\Services;

class IdentityVerificationService
{
    public function calculateScore($citizen, array $ocrData): int
    {
        $score = 0;

        if (isset($ocrData['first_name']) && $citizen->user->first_name === $ocrData['first_name']) {
            $score += 25;
        }

        if (isset($ocrData['last_name']) && $citizen->user->last_name === $ocrData['last_name']) {
            $score += 25;
        }

        if (isset($ocrData['father_name']) && $citizen->father_name === $ocrData['father_name']) {
            $score += 25;
        }

        if (isset($ocrData['national_number']) && $citizen->user->national_id === $ocrData['national_number']) {
            $score += 25;
        }

        return $score;
    }
}
