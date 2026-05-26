<?php

namespace App\Services;

class SignatureService
{
    /**
     * توقيع البيانات باستخدام المفتاح الخاص
     */
    public function sign(array $payload): string
    {
        // 1. جلب المفتاح الخاص (متعدد الأسطر) من الإعدادات
        $privateKey = config('services.signature.private_key');

        if (empty($privateKey)) {
            throw new \Exception('المفتاح الخاص غير موجود في الإعدادات.');
        }

        // 2. تحويل البيانات إلى نص JSON للتمكن من توقيعها
        $dataToSign = json_encode($payload);

        // 3. إنشاء التوقيع الرقمي (RSA-SHA256)
        $isSigned = openssl_sign($dataToSign, $signature, $privateKey, OPENSSL_ALGO_SHA256);

        if (!$isSigned) {
            throw new \Exception('فشلت عملية التوقيع الرقمي.');
        }

        // 4. إرجاع التوقيع مشفراً بـ Base64 لسهولة تخزينه في قاعدة البيانات والـ QR
        return base64_encode($signature);
    }
}
