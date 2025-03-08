<?php

namespace App\Http\Controllers;
use App\Models\Vetement;
use App\Models\Lavage;
use App\Models\Emplacement;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Mail\VetementsPretsMail;
use App\Mail\VetementsEnLavageMail;
use Illuminate\Support\Facades\Mail;


class VetementController extends Controller
{

    public function retirer(Vetement $vetement)
{
    $vetement->update(['etat' => 'Retiré']);
    return back()->with('success', 'Vêtement marqué comme retiré.');
}
 
public function updateEtat(Request $request, $id)
{

    // Validation des données
    $validated = $request->validate([
        'etat' => 'required|in:En lavage,En repassage,Terminé,Retiré',
    ]);

    // Récupérer le vêtement à mettre à jour
    $vetement = Vetement::with('lavage.vetements', 'lavage.client')->findOrFail($id);

    // Mettre à jour l'état du vêtement et associer l'acteur correspondant
    if ($validated['etat'] === 'En repassage') {
        $vetement->laveur_id = Auth::guard('web')->id(); // ID du laveur authentifié
    } elseif ($validated['etat'] === 'Terminé') {
        $vetement->repasseur_id = Auth::guard('web')->id(); // ID du repasseur authentifié
    }

    $vetement->etat = $validated['etat'];
    $vetement->save(); // Sauvegarder les modifications

    // Vérifier si tous les vêtements du lavage sont à l'état "Terminé"
    $lavage = Lavage::with('vetements')->findOrFail($vetement->lavage_id);
    $tousPrets = $lavage->vetements->every(fn($v) => $v->etat === 'Terminé');

    if ($tousPrets) {
        // Envoyer un email au client si tous les vêtements sont prêts
        Mail::to($lavage->client->email)->send(new VetementsPretsMail($lavage));
    }
    // Vérifier si tous les vêtements du lavage sont à l'état "En Lavage"
    $lavage = Lavage::with('vetements')->findOrFail($vetement->lavage_id);
    $tousEnLavage = $lavage->vetements->every(fn($v) => $v->etat === 'En lavage');

    if ($tousEnLavage) {
        // Envoyer un email au client si tous les vêtements sont prêts
        Mail::to($lavage->client->email)->send(new VetementsEnLavageMail($lavage));
    }

    return redirect()->back()->with('success', 'État du vêtement mis à jour avec succès.');
}


public function indexLavage()
{
    // Récupérer l'utilisateur connecté (acteur)
    $acteur = Auth::guard('web')->user();

    // Vérifier qu'un acteur est bien connecté
    if (!$acteur) {
        return redirect()->route('acteurs.login'); // Redirection si non connecté
    }



    // Récupérer la structure associée à l'acteur connecté
    $structureId = $acteur->structure_id;

    // Récupérer les vêtements des lavages liés à cette structure
    $vetements = Vetement::whereHas('lavage', function ($query) use ($structureId) {
        $query->whereHas('receptionniste', function ($subQuery) use ($structureId) {
            $subQuery->where('structure_id', $structureId);
        });
    })
    ->where('etat', 'En lavage')
    ->with(['categorie', 'type', 'lavage'])
    ->get();

    return inertia('TacheLavages', [
        'vetements' => $vetements,
    ]);
}

public function indexRepassage()
{
    // Récupérer l'utilisateur connecté (acteur)
    $acteur = Auth::guard('web')->user();

    // Vérifier qu'un acteur est bien connecté
    if (!$acteur) {
        return redirect()->route('acteurs.login'); // Redirection si non connecté
    }

    // Récupérer la structure associée à l'acteur connecté
    $structureId = $acteur->structure_id;

    // Récupérer les vêtements des lavages liés à cette structure
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

    // Récupérer les emplacements liés à la structure
    $emplacements = Emplacement::where('structure_id', $structureId)->get();
   

    return inertia('TacheRepassage', [
        'vetements' => $vetements,
        'emplacements' => $emplacements, // Envoi des emplacements à la page
        'lavagesTermines' => $lavagesTermines,
    ]);
}

}
