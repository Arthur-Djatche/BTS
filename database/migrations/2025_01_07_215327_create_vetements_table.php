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
            $table->foreignId('categorie_id')->constrained()->onDelete('cascade');
            $table->foreignId('type_id')->constrained()->onDelete('cascade');
            $table->foreignId('lavage_id')->constrained()->onDelete('cascade');
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->string('couleur'); // Code couleur ex: #ffffff
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('vetements');
    }
}
