<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;

class VerificationController extends Controller
{
    public function verifyPublic(Request $request, $id)
    {
        $signatureFromUrl = $request->query('sig');

        if (!$signatureFromUrl) {
            return view('verification.fraud', ['message' => 'رابط التحقق غير مكتمل أو التوقيع مفقود.']);
        }

        // 1. جلب الوثيقة مع الـ QR Code المرتبط بها
        $document = Document::with('qrCode')->findOrFail($id);

        if (!$document->qrCode) {
            return view('verification.fraud', ['message' => 'رمز التحقق لهذه الوثيقة غير موجود في النظام.']);
        }

        // 2. استخراج البيانات المؤرشفة لحظة الإصدار
        $payload = json_decode($document->qrCode->payload, true);
        $originalData = json_encode($payload['data']);
        $savedSignature = $payload['signature'];

        // 3. تأمين إضافي: التأكد من أن التوقيع في الرابط يطابق التوقيع في قاعدة البيانات
        // (استبدال المسافات بـ + لأن الروابط أحياناً تشوه علامة + في الـ Base64)
        // if (str_replace(' ', '+', $signatureFromUrl) !== $savedSignature) {
        //     return view('verification.fraud', ['message' => 'التوقيع غير متطابق. هذا الرابط مزيف!']);
        // }


        $payload = json_decode($document->qrCode->payload, true);
        $originalData = json_encode($payload['data']);
        $savedSignature = $payload['signature'];

        // 🌟 3. تأمين إضافي (مُحدَّث): تنظيف التوقيعات من شوائب النسخ اليدوي (URL Encoding)
        // أ- إعادة المسافات إلى علامة +، وإزالة علامات الهروب \/ إن وجدت
        $cleanSignatureFromUrl = trim(str_replace([' ', '\\/'], ['+', '/'], urldecode($signatureFromUrl)));
        $cleanSavedSignature   = trim(str_replace('\\/', '/', $savedSignature));

        // ب- المطابقة بعد التنظيف
        if ($cleanSignatureFromUrl !== $cleanSavedSignature) {
            return view('verification.fraud', ['message' => 'التوقيع غير متطابق. هذا الرابط مزيف أو تالف!']);
        }

        // 4. التحقق الرياضي بالتشفير (RSA)
        $publicKey = config('services.signature.public_key');
        $isValid = openssl_verify($originalData, base64_decode($savedSignature), $publicKey, OPENSSL_ALGO_SHA256);

        if ($isValid === 1) {
            // التوقيع سليم 100%
            return view('verification.success', ['data' => $payload['data']]);
        } else {
            // التوقيع مزور
            return view('verification.fraud', ['message' => 'تحذير أمني: الوثيقة مزورة أو تم التلاعب ببياناتها!']);
        }
    }
}
