<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Emplacement extends Model
{
    use HasFactory;

    protected $fillable = ['nom','structure_id', 'actif'];

    public function lavages()
    {
        return $this->hasMany(Lavage::class);
    }
    public function structure()
    {
        return $this->belongsTo(Structure::class);
    }
}
