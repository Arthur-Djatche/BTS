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
        Schema::table('lavages', function (Blueprint $table) {
            $table->foreignId('consigne_id')->constrained()->onDelete('cascade');
            $table->decimal('kilogrammes', 10, 2)->nullable();
            $table->decimal('tarif_total', 10, 2)->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
