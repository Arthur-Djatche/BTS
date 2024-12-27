<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRememberTokenToActeursTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Vérifie si la colonne remember_token existe déjà
        if (!Schema::hasColumn('acteurs', 'remember_token')) {
            Schema::table('acteurs', function (Blueprint $table) {
                $table->string('remember_token', 100)->nullable()->after('role');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('acteurs', function (Blueprint $table) {
            $table->dropColumn('remember_token');
        });
    }
}
