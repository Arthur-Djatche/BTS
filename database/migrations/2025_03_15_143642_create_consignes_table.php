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
        Schema::create('consignes', function (Blueprint $table) {
            $table->id();
            $table->char('actif', 1)->default('O');
            $table->string('nom')->unique();
            $table->enum('type_consigne', ['Lavage_Simple', 'Repassage_Simple', 'Lavage_Repassage']); 
            $table->enum('priorite_consigne', ['Classique', 'Express']); 
            $table->decimal('pourcentage_variation', 5, 2); // Ex: 15% => 0.15
            $table->foreignId('structure_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consignes');
       
    }
};
