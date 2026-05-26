<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class GenerateRSAKeys extends Command
{
    protected $signature = 'keys:generate-rsa';
    protected $description = 'توليد مفاتيح RSA للتوقيع الرقمي للوثائق';

    public function handle()
    {
        $config = [
            "digest_alg"       => "sha256",
            "private_key_bits" => 2048,
            "private_key_type" => OPENSSL_KEYTYPE_RSA,
        ];

        // 1. توليد المفاتيح
        $res = openssl_pkey_new($config);

        if (!$res) {
            $this->error('فشل في توليد المفاتيح. تأكد من تفعيل إضافة openssl في ملف php.ini');
            return;
        }

        // 2. استخراج المفتاح الخاص
        openssl_pkey_export($res, $privateKey);

        // 3. استخراج المفتاح العام
        $publicKey = openssl_pkey_get_details($res)["key"];

        // 4. حفظ المفاتيح في مجلد local (يجب ألا تكون مرئية للعامة)
        Storage::disk('local')->put('keys/private.pem', $privateKey);
        Storage::disk('local')->put('keys/public.pem', $publicKey);

        $this->info('تم توليد مفاتيح RSA بنجاح وحفظها في مجلد storage/app/keys');
    }
}
