<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Abonnement extends Model
{
    use HasFactory;
    
    protected $fillable = ['nom','actif', 'limite_lavages', 'limite_consigne', 'limite_categories', 'limite_types', 'prix'];
    protected $casts = [
        'actif' => 'string', // "O" ou "N"
    ];
    public function structures()
    {
        return $this->hasMany(Structure::class);
    }
}
