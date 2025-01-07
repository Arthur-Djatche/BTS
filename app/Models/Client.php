<?php 
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'prenom', 'email', 'telephone'];

    public function lavages()
    {
        return $this->hasMany(Lavage::class);
    }
}
