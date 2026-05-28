<?php

namespace App\Services;

class SignatureService
{
    public function sign(array $payload): string
    {
        $privateKey = config('services.signature.private_key');

        if (empty($privateKey)) {
            throw new \Exception('المفتاح الخاص غير موجود في الإعدادات.');
        }

        $dataToSign = json_encode($payload);

        $isSigned = openssl_sign($dataToSign, $signature, $privateKey, OPENSSL_ALGO_SHA256);

        if (!$isSigned) {
            throw new \Exception('فشلت عملية التوقيع الرقمي.');
        }

        return base64_encode($signature);
    }

    public function generateVerifyUrl(int $documentId, string $signature): string
    {
        return route('document.verify.public', [
            'req' => $documentId,
            'sig' => $signature
        ]);
    }
}
