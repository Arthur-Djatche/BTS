<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categorie extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'structure_id', 'actif','tarif_base'];

    public function vetements()
    {
        return $this->hasMany(Vetement::class);
    }
}
