<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;

class VerificationController extends Controller
{
    public function verifyPublic(Request $request)
    {
        $reqId = $request->query('req');
        $signatureFromUrl = $request->query('sig');

        if (!$reqId || !$signatureFromUrl) {
            return view('verification.fraud', ['message' => 'رابط التحقق غير مكتمل، المعرف أو التوقيع مفقود.']);
        }

        $document = Document::with('qrCode')->find($reqId);

        if (!$document || !$document->qrCode) {
            return view('verification.fraud', ['message' => 'هذه الوثيقة أو رمز التحقق الخاص بها غير موجود في النظام.']);
        }

        $payload = json_decode($document->qrCode->payload, true);
        $originalData = json_encode($payload['data']);
        $savedSignature = $payload['signature'];

        $cleanSignatureFromUrl = trim(str_replace([' ', '\\/'], ['+', '/'], urldecode($signatureFromUrl)));
        $cleanSavedSignature   = trim(str_replace('\\/', '/', $savedSignature));

        if ($cleanSignatureFromUrl !== $cleanSavedSignature) {
            return view('verification.fraud', ['message' => 'التوقيع غير متطابق. هذا الرابط مزيف أو تالف!']);
        }

        $publicKey = config('services.signature.public_key');
        $isValid = openssl_verify($originalData, base64_decode($savedSignature), $publicKey, OPENSSL_ALGO_SHA256);

        if ($isValid === 1) {
            return view('verification.success', ['data' => $payload['data']]);
        } else {
            return view('verification.fraud', ['message' => 'تحذير أمني: الوثيقة مزورة أو تم التلاعب ببياناتها!']);
        }
    }
}
