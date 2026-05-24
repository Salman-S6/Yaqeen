<?php

namespace Database\Seeders;

use App\Models\ServiceType;
use Illuminate\Database\Seeder;

class ServiceTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $serviceTypes = [
            ['name' => 'إخراج قيد فردي', 'is_active' => true],
            ['name' => 'بيان عائلي', 'is_active' => true],
            ['name' => 'لا حكم عليه', 'is_active' => true],
            ['name' => 'سند إقامة', 'is_active' => true],
            ['name' => 'وثيقة غير موظف', 'is_active' => true],
            ['name' => 'بيان ولادة', 'is_active' => true],
        ];

        foreach ($serviceTypes as $serviceType) {
            ServiceType::firstOrCreate($serviceType);
        }
    }
}
