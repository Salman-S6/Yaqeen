<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $this->createAdmin();
        $this->createEmployee();
    }

    // -------------------------------------------------------------------------

    private function createAdmin(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin@yaqeen.test'],
            [
                'first_name'  => 'مدير',
                'last_name'   => 'النظام',
                'national_id' => '00000000001',
                'email'       => 'admin@yaqeen.test',
                'password'    => Hash::make('Password@123'),
                'status'      => 'active',
            ]
        );

        // منع تكرار الدور عند إعادة الـ Seed
        if (! $admin->hasRole('admin')) {
            $admin->assignRole('admin');
        }

    }

    // -------------------------------------------------------------------------

    private function createEmployee(): void
    {
        $employee = User::updateOrCreate(
            ['email' => 'employee@yaqeen.test'],
            [
                'first_name'  => 'موظف',
                'last_name'   => 'الاختبار',
                'national_id' => '00000000002',
                'email'       => 'employee@yaqeen.test',
                'password'    => Hash::make('Password@123'),
                'status'      => 'active',
            ]
        );

        if (! $employee->hasRole('employee')) {
            $employee->assignRole('employee');
        }

    }
}