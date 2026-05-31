<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\VerificationLog;
use Illuminate\Http\Request;

class VerificationController extends Controller
{
    public function verifyPublic(Request $request)
    {
        $reqId = $request->query('req');
        $payloadFromUrl = $request->query('p');
        $signatureFromUrl = $request->query('sig');

        if (! $reqId || ! $payloadFromUrl || ! $signatureFromUrl) {
            return view('verification.fraud', ['message' => 'رابط التحقق غير مكتمل.']);
        }

        $document = Document::find($reqId);
        if (! $document) {
            return view('verification.fraud', ['message' => 'هذه الوثيقة ملغاة أو غير موجودة في النظام.']);
        }

        $cleanSignature = trim(str_replace([' ', '\\/'], ['+', '/'], urldecode($signatureFromUrl)));
        $publicKey = config('services.signature.public_key');
        $isValid = openssl_verify($payloadFromUrl, base64_decode($cleanSignature), $publicKey, OPENSSL_ALGO_SHA256);

        $resultStatus = ($isValid === 1) ? 'valid' : 'forged';
        $ipAddress = $request->ip();

        VerificationLog::create([
            'document_id' => $document->id,
            'result' => $resultStatus,
            'ip_address' => $ipAddress,
            // يمكن لاحقاً استخدام مكتبة مثل stevebauman/location لتحويل الـ IP إلى اسم منظمة هنا
            'verifier_organization' => null,
            'verified_at' => now(),
        ]);

        if ($isValid === 1) {
            $data = json_decode(base64_decode($payloadFromUrl), true);

            return view('verification.success', ['data' => $data]);
        } else {
            return view('verification.fraud', ['message' => 'تحذير أمني: الوثيقة مزورة أو تم التلاعب ببياناتها!']);
        }
    }
}
