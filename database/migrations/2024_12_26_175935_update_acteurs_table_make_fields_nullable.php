<?php 
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateActeursTableMakeFieldsNullable extends Migration
{
    public function up()
    {
        Schema::table('acteurs', function (Blueprint $table) {
            $table->string('nom')->nullable()->change();
            $table->string('prenom')->nullable()->change();
            $table->string('password')->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('acteurs', function (Blueprint $table) {
            $table->string('nom')->nullable(false)->change();
            $table->string('prenom')->nullable(false)->change();
            $table->string('password')->nullable(false)->change();
        });
    }
}
