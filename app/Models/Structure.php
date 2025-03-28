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
    public function lavages()
{
    return $this->hasManyThrough(
        Lavage::class,
        Acteur::class,
        'structure_id', // Foreign key sur la table `acteurs`
        'receptionniste_id', // Foreign key sur la table `lavages`
        'id', // Primary key sur la table `structures`
        'id'  // Primary key sur la table `acteurs`
    );
}
public function abonnement()
{
    return $this->belongsTo(Abonnement::class);
}

}
