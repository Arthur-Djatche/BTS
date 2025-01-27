<?php

namespace App\Http\Controllers;
use App\Models\Vetement;
use App\Models\Lavage;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Mail\VetementsPretsMail;
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
        $vetement->laveur_id = Auth::id(); // ID du laveur authentifié
    } elseif ($validated['etat'] === 'Terminé') {
        $vetement->repasseur_id = Auth::id(); // ID du repasseur authentifié
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

    return redirect()->back()->with('success', 'État du vêtement mis à jour avec succès.');
}


public function indexLavage()
{
    $vetements = Vetement::where('etat', 'En lavage')->with('categorie', 'type')->get();

    return inertia('TacheLavages', [
        'vetements' => $vetements,
    ]);
}
public function indexRepassage()
{
    $vetements = Vetement::where('etat', 'En repassage')->with('categorie', 'type')->get();

    return inertia('TacheRepassage', [
        'vetements' => $vetements,
    ]);
}

}
