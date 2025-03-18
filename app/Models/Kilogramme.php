<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Kilogramme extends Model
{
    use HasFactory;

    protected $fillable = ['min_kg', 'actif', 'max_kg','tarif','structure_id'];

    public function lavages()
    {
        return $this->hasMany(Lavage::class);
    }
}
