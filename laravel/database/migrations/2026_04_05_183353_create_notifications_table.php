<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->foreignId('request_id')->nullable()->constrained('requests')->cascadeOnDelete();
            $table->enum('type', ['accepted', 'rejected', 'received']);
            $table->string('subject');
            $table->text('message');
            $table->string('email_to')->required();
            $table->boolean('is_sent')->default(false);
            $table->tinyInteger('retry_count')->default(0);
            $table->timestamp('sent_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
