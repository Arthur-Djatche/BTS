<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateActeursTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('acteurs', function (Blueprint $table) {
            $table->id(); // Clé primaire
            $table->string('nom')->nullable();; // Champ nom
            $table->string('prenom')->nullable(); // Champ prénom
            $table->string('email')->unique(); // Email unique
            $table->string('telephone')->nullable(); // Téléphone optionnel
            $table->string('password'); // Mot de passe
            $table->rememberToken();
            // Ajouter une colonne 'role' avec une valeur par défaut 'laveur'
            $table->enum('role', ['super_admin','admin', 'receptionniste', 'laveur', 'repasseur'])
            
                  ->default('laveur');
            $table->timestamps(); // created_at et updated_at
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('acteurs');
    }
}
