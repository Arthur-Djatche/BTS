<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVetementsTable extends Migration
{
    public function up()
    {
        Schema::create('vetements', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('lavage_id')->constrained()->onDelete('cascade');
            $table->string('couleur'); // Code couleur ex: #ffffff

            $table->foreignId('laveur_id')->nullable()->constrained('acteurs')->onDelete('set null'); // ✅ Peut être NULL si non obligatoire
            $table->foreignId('repasseur_id')->nullable()->constrained('acteurs')->onDelete('set null'); // ✅ Peut être NULL si non obligatoire

          

            $table->enum('etat', ['Initial','etiquettage', 'En lavage', 'En repassage', 'Terminé','Retiré'])
                  ->default('Initial'); // Ajoute après la colonne 'couleur'
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('vetements');
    }
}
