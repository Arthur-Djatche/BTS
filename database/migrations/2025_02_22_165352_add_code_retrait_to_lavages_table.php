<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('lavages', function (Blueprint $table) {
            $table->string('code_retrait')->unique()->nullable()->after('client_id');
        });
    }

    public function down()
    {
        Schema::table('lavages', function (Blueprint $table) {
            $table->dropColumn('code_retrait');
        });
    }
};
