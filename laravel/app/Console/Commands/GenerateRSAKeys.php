<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class GenerateRSAKeys extends Command
{
    protected $signature = 'keys:generate-rsa';

    protected $description = 'توليد مفاتيح RSA وتخزينها مباشرة في ملف .env';

    public function handle()
    {
        $config = [
            'digest_alg' => 'sha256',
            'private_key_bits' => 2048,
            'private_key_type' => OPENSSL_KEYTYPE_RSA,
            'config' => 'C:/xampp/php/extras/ssl/openssl.cnf',
        ];

        $res = openssl_pkey_new($config);

        if (! $res) {
            $error = openssl_error_string();
            $this->error('فشل في توليد المفاتيح: '.$error);

            return;
        }

        openssl_pkey_export($res, $privateKey, null, $config);

        $publicKey = openssl_pkey_get_details($res)['key'];

        $this->updateEnvironmentFile('PRIVATE_KEY', $privateKey);
        $this->updateEnvironmentFile('PUBLIC_KEY', $publicKey);

        $this->info('تم توليد مفاتيح RSA بنجاح وحقنها تلقائياً في ملف .env!');
    }

    private function updateEnvironmentFile($key, $value)
    {
        $path = app()->environmentFilePath();
        $env = file_get_contents($path);

        $formattedValue = '"'.trim($value).'"';

        if (preg_match("/^{$key}=\".*?\"/ms", $env)) {
            $env = preg_replace("/^{$key}=\".*?\"/ms", "{$key}={$formattedValue}", $env);
        } elseif (preg_match("/^{$key}=.*/m", $env)) {
            $env = preg_replace("/^{$key}=.*/m", "{$key}={$formattedValue}", $env);
        } else {
            $env .= "\n{$key}={$formattedValue}\n";
        }

        file_put_contents($path, $env);
    }
}
