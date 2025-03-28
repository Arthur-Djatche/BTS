<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('abonnements', function (Blueprint $table) {
        $table->id();
        $table->char('actif', 1)->default('O');
        $table->string('nom');
        $table->integer('limite_lavages'); // Nombre max de lavages
        $table->integer('limite_consigne'); // Nombre max de consignes
        $table->integer('limite_categories'); // Nombre max de catégories
        $table->integer('limite_types'); // Nombre max de types de vêtements
        $table->decimal('prix', 10, 2);
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('abonnements');
    }
};
