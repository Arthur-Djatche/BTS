<?php 
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vetement extends Model
{
    use HasFactory;

    protected $fillable = ['categorie_id', 'type_id', 'lavage_id', 'client_id', 'couleur'];

    public function categorie()
    {
        return $this->belongsTo(Categorie::class);
    }

    public function type()
    {
        return $this->belongsTo(Type::class);
    }

    public function lavage()
    {
        return $this->belongsTo(Lavage::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
