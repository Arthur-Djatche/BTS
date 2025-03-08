<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lavage extends Model
{
    use HasFactory;

    protected $fillable = ['client_id', 'code_retrait','receptionniste_id','emplacement_id',];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function vetements()
    {
        return $this->hasMany(Vetement::class);
    }

    public function receptionniste()
{
    return $this->belongsTo(Acteur::class, 'receptionniste_id');
}

public function emplacement()
{
    return $this->belongsTo(Emplacement::class);
}


}
