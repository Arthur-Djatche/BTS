<?php 
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('structures', function (Blueprint $table) {
            $table->id();
            $table->string('nom_structure');
            $table->string('nom_admin');
            $table->string('ville');
            $table->string('email')->unique();
            $table->string('telephone');
            $table->string('password');
            $table->timestamps();
        });

        // Ajouter la colonne structure_id dans acteurs
        Schema::table('acteurs', function (Blueprint $table) {
            $table->foreignId('structure_id')->constrained('structures')->onDelete('cascade');
        });
        // Ajouter la colonne structure_id dans client
        Schema::table('clients', function (Blueprint $table) {
            $table->foreignId('structure_id')->constrained('structures')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('acteurs', function (Blueprint $table) {
            $table->dropForeign(['structure_id']);
            $table->dropColumn('structure_id');
        });

        Schema::dropIfExists('structures');
    }
};
