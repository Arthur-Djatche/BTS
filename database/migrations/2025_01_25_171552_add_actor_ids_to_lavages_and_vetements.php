<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddActorIdsToLavagesAndVetements extends Migration
{
    public function up()
    {
        // Ajout de la colonne receptionniste_id dans la table lavages
        Schema::table('lavages', function (Blueprint $table) {
            $table->unsignedBigInteger('receptionniste_id')->nullable()->after('client_id');
            $table->foreign('receptionniste_id')->references('id')->on('acteurs')->onDelete('cascade');
        });

        // Ajout des colonnes laveur_id et repasseur_id dans la table vetements
        Schema::table('vetements', function (Blueprint $table) {
            $table->unsignedBigInteger('laveur_id')->nullable()->after('couleur');
            $table->foreign('laveur_id')->references('id')->on('acteurs')->onDelete('cascade');

            $table->unsignedBigInteger('repasseur_id')->nullable()->after('laveur_id');
            $table->foreign('repasseur_id')->references('id')->on('acteurs')->onDelete('cascade');
        });
    }

    public function down()
    {
        // Supprimer les colonnes ajoutées en cas de rollback
        Schema::table('lavages', function (Blueprint $table) {
            $table->dropForeign(['receptionniste_id']);
            $table->dropColumn('receptionniste_id');
        });

        Schema::table('vetements', function (Blueprint $table) {
            $table->dropForeign(['laveur_id']);
            $table->dropColumn('laveur_id');

            $table->dropForeign(['repasseur_id']);
            $table->dropColumn('repasseur_id');
        });
    }
}
