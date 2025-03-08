<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable; // ✅ Importation du bon modèle
use Illuminate\Notifications\Notifiable;

class Structure extends Authenticatable

{
    use HasFactory;

    protected $fillable = ['nom_structure', 'nom_admin', 'ville', 'email', 'telephone', 'password'];

    public function acteurs()
    {
        return $this->hasMany(Acteur::class);
    

    }
    public function emplacements()
    {
        return $this->hasMany(Emplacement::class);
    

    }
}
