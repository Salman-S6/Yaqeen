<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->timestamp('read_at')->nullable()->after('sent_at');

            if (!Schema::hasColumn('notifications', 'created_at')) {
                $table->timestamp('created_at')->useCurrent();
            }
        });
    }

    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->dropColumn(['read_at', 'created_at']);
        });
    }
};
