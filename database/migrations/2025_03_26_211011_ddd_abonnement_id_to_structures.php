<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('structures', function (Blueprint $table) {
        $table->foreignId('abonnement_id')->nullable()->constrained('abonnements')->onDelete('set null');
        $table->boolean('active')->default(true); // Activer/désactiver structure
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('structures', function (Blueprint $table) {
            //
        });
    }
};
