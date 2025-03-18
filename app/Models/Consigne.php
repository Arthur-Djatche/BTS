<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Consigne extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'actif', 'pourcentage_variation','type_consigne','structure_id','priorite_consigne'];

    public function lavages()
    {
        return $this->hasMany(Lavage::class);
    }
}
