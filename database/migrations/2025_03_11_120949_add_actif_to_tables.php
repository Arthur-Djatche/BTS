<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        foreach (['emplacements', 'types', 'categories', 'acteurs','structures'] as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->char('actif', 1)->default('O')->after('id'); // Ajout de la colonne actif
            });
        }
    }

    public function down()
    {
        foreach (['emplacements', 'types', 'categories', 'acteurs', 'structures'] as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->dropColumn('actif');
            });
        }
    }
};
