<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class GenerateRSAKeys extends Command
{
    protected $signature = 'keys:generate-rsa';
    protected $description = 'توليد مفاتيح RSA وتخزينها مباشرة في ملف .env';

    public function handle()
    {
        $config = [
            "digest_alg"       => "sha256",
            "private_key_bits" => 2048,
            "private_key_type" => OPENSSL_KEYTYPE_RSA,
            // 🌟 إضافة مسار إعدادات XAMPP الذي نجح معك
            "config"           => "C:/xampp/php/extras/ssl/openssl.cnf",
        ];

        // 1. توليد المفاتيح
        $res = openssl_pkey_new($config);

        if (!$res) {
            // استخدام openssl_error_string لمعرفة الخطأ الدقيق إن حدث
            $error = openssl_error_string();
            $this->error('فشل في توليد المفاتيح: ' . $error);
            return;
        }

        // 2. استخراج المفتاح الخاص (🌟 يجب تمرير $config هنا أيضاً كما فعلت في كودك)
        openssl_pkey_export($res, $privateKey, null, $config);

        // 3. استخراج المفتاح العام
        $publicKey = openssl_pkey_get_details($res)["key"];

        // 4. حقن المفاتيح في ملف .env
        $this->updateEnvironmentFile('PRIVATE_KEY', $privateKey);
        $this->updateEnvironmentFile('PUBLIC_KEY', $publicKey);

        $this->info('تم توليد مفاتيح RSA بنجاح وحقنها تلقائياً في ملف .env!');
    }

    /**
     * دالة مساعدة لتحديث أو إضافة المتغيرات في ملف .env برمجياً
     */
    private function updateEnvironmentFile($key, $value)
    {
        $path = app()->environmentFilePath();
        $env = file_get_contents($path);

        // تغليف المفتاح بعلامات تنصيص مزدوجة للحفاظ على الأسطر المتعددة
        $formattedValue = '"' . trim($value) . '"';

        // إذا كان المفتاح موجوداً مسبقاً (ومغلفاً بعلامات تنصيص)، قم باستبداله
        if (preg_match("/^{$key}=\".*?\"/ms", $env)) {
            $env = preg_replace("/^{$key}=\".*?\"/ms", "{$key}={$formattedValue}", $env);
        }
        // إذا كان المفتاح موجوداً بدون علامات تنصيص، قم باستبداله
        elseif (preg_match("/^{$key}=.*/m", $env)) {
            $env = preg_replace("/^{$key}=.*/m", "{$key}={$formattedValue}", $env);
        }
        // إذا لم يكن موجوداً من الأساس، أضفه في نهاية الملف
        else {
            $env .= "\n{$key}={$formattedValue}\n";
        }

        // حفظ التعديلات
        file_put_contents($path, $env);
    }
}
