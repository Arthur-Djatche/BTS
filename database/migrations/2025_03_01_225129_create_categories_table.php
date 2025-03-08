<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->foreignId('structure_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });

        // Ajouter la colonne structure_id dans client
        Schema::table('vetements', function (Blueprint $table) {
            $table->foreignId('categorie_id')->constrained('categories')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
