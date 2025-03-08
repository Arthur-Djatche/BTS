<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('emplacements', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->foreignId('structure_id')->nullable()->constrained()->onDelete('cascade');
            $table->timestamps();
        });

        // Ajouter la colonne emplacement_id dans lavages
        Schema::table('lavages', function (Blueprint $table) {
            $table->foreignId('emplacement_id')->nullable()->constrained('emplacements')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('lavages', function (Blueprint $table) {
            $table->dropForeign(['emplacement_id']);
            $table->dropColumn('emplacement_id');
        });

        Schema::dropIfExists('emplacements');
    }
};
