<?php
namespace App\Http\Controllers;

use App\Mail\VetementsTerminer;
use App\Mail\VetementsTerminerMail;
use App\Models\Vetement;
use App\Models\Lavage;
use App\Models\Emplacement;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;


class RepassageController extends Controller
{

public function indexRepassage()
{
    $acteur = Auth::guard('web')->user();
    if (!$acteur) {
        return redirect()->route('acteurs.login');
    }

    $structureId = $acteur->structure_id;

    // Récupérer les vêtements en repassage
    $vetements = Vetement::whereHas('lavage', function ($query) use ($structureId) {
            $query->whereHas('receptionniste', function ($subQuery) use ($structureId) {
                $subQuery->where('structure_id', $structureId);
            });
        })
        ->where('etat', 'En repassage')
        ->with(['categorie', 'type', 'lavage'])
        ->get();

    // Récupérer les lavages dont tous les vêtements sont terminés
    $lavagesTermines = Lavage::whereDoesntHave('vetements', function ($query) {
        $query->where('etat', '!=', 'Terminé');
    }) // Vérifie que tous les vêtements sont terminés
    ->whereNull('emplacement_id') // Vérifie que l'emplacement_id est NULL
    ->whereHas('receptionniste', function ($subQuery) use ($structureId) {
        $subQuery->where('structure_id', $structureId);
    })
    ->get();


    // Récupérer les emplacements de la structure
    $emplacements = Emplacement::where('structure_id', $structureId)->get();

    return Inertia::render('TacheRepassage', [
        'vetements' => $vetements,
        'emplacements' => $emplacements,
        'lavagesTermines' => $lavagesTermines
    ]);
}

public function updateEtat(Vetement $vetement)
{
    $vetement->update(['etat' => 'Terminé']);

    return redirect()->route('tache.repassage');
}

public function updateEmplacement(Lavage $lavage)
{
    request()->validate([
        'emplacement_id' => 'required|exists:emplacements,id'
    ]);

    $lavage->update(['emplacement_id' => request('emplacement_id')]);

    return redirect()->route('tache.repassage');
}

}
