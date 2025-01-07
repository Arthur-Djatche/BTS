<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLavagesTable extends Migration
{
    public function up()
    {
        Schema::create('lavages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('client_id'); // Doit correspondre à $table->id() dans `clients` 
            $table->timestamps();
              // Clé étrangère
              $table->foreign('client_id')->references('id')->on('clients')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('lavages');
    }
}
