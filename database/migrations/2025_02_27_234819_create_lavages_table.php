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
            $table->string('code_retrait')->unique(); // Si c'est un code unique
            $table->unsignedBigInteger('client_id'); // Doit correspondre à $table->id() dans `clients` 
            $table->timestamps();
            $table->enum('status', ['Non payé', 'Payé',])->nullable();
              // Clé étrangère
            $table->unsignedBigInteger('receptionniste_id');
            $table->foreign('receptionniste_id')->references('id')->on('acteurs')->onDelete('cascade');
            $table->foreign('client_id')->references('id')->on('clients')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('lavages');
    }
}
