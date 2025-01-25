<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddEtatToVetementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('vetements', function (Blueprint $table) {
            // Ajout de la colonne ENUM 'etat' avec des valeurs spécifiques
            $table->enum('etat', ['Initial', 'En lavage', 'En repassage', 'Terminé','Retiré'])
                  ->default('Initial')
                  ->after('couleur'); // Ajoute après la colonne 'couleur'
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('vetements', function (Blueprint $table) {
            // Suppression de la colonne 'etat'
            $table->dropColumn('etat');
        });
    }
}
