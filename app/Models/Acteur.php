<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Acteur extends Authenticatable
{
    use HasFactory;

    protected $table = 'acteurs'; // Nom de la table dans la base de données

    // Colonnes autorisées pour l'insertion
    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'telephone',
        'password',
        'role',
        'structure_id', // ✅ Assurez-vous que c'est bien présent ici
        'actif',
    ];

    // Si vous avez des colonnes cachées, ajoutez-les ici
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function structure()
{
    return $this->belongsTo(Structure::class);
}

}
