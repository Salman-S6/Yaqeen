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
        Schema::create('ocr_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attachment_id')->constrained('attachments')->cascadeOnDelete();
            $table->string('extracted_first_name'); 
            $table->string('extracted_last_name');
            $table->string('extracted_father_name')->nullable();
            $table->string('extracted_mother_first_name')->nullable();
            $table->string('extracted_mother_last_name')->nullable();
            $table->string('extracted_national_id');
            $table->date('extracted_dob')->nullable();
            $table->string('extracted_place')->nullable();
            $table->float('confidence_score');
            $table->string('engine_used')->nullable();
            $table->timestamp('processed_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ocr_results');
    }
};
