<?php

namespace App\Http\Controllers;
use App\Mail\VetementsRetirerMail;
use App\Models\Vetement;
use App\Models\Lavage;
use App\Models\Emplacement;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Mail\VetementsPretsMail;
use App\Mail\VetementsEnLavageMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;


class VetementController extends Controller
{

    public function retirer(Vetement $vetement)
{
    $vetement->update(['etat' => 'Retiré']);
    return back()->with('success', 'Vêtement marqué comme retiré.');
}
 
public function updateEtat(Request $request, $id)
{
    // ✅ Validation des données envoyées
    $validated = $request->validate([
        'etat' => 'required|in:En lavage,En repassage,Terminé,Retiré',
        'type_consigne' => 'nullable|string'
    ]);

    // ✅ Récupérer le vêtement à mettre à jour avec la relation lavage et consigne
    $vetement = Vetement::with('lavage.consigne')->findOrFail($id);

     // ✅ Log pour vérifier les relations
     Log::info("💾 Vetement trouvé :", ['id' => $vetement->id, 'etat_actuel' => $vetement->etat]);

    // ✅ Déterminer le type de consigne

    // Vérifier si l’état change correctement
    if ($validated['etat'] === 'En repassage' && $vetement->lavage->consigne->type_consigne === 'Repassage_Simple') {
        Log::info("🛠 Repassage simple détecté, laveur_id reste NULL");
        $vetement->laveur_id = null; 
    } elseif ($validated['etat'] === 'En repassage') {
        $vetement->laveur_id = Auth::guard('web')->id();
    }
     elseif ($validated['etat'] === 'Terminé' && $vetement->lavage->consigne->type_consigne === 'Lavage_Simple') {
        $vetement->laveur_id = Auth::guard('web')->id();
        $vetement->repasseur_id = null;
    }
     elseif ($validated['etat'] === 'Terminé') {
        $vetement->repasseur_id = Auth::guard('web')->id();
    }

    // ✅ Mise à jour de l'état
    $vetement->etat = $validated['etat'];
    $vetement->save(); // Sauvegarde

    // Vérifier si tous les vêtements du lavage sont "Terminé"
    $lavage = Lavage::with('vetements')->findOrFail($vetement->lavage_id);
    $tousPrets = $lavage->vetements->every(fn($v) => $v->etat === 'Terminé');

    if ($tousPrets) {
        Mail::to($lavage->client->email)->send(new VetementsPretsMail($lavage));
    }

    // Vérifier si tous les vêtements sont "En lavage"
    $tousEnLavage = $lavage->vetements->every(fn($v) => $v->etat === 'En lavage');

    if ($tousEnLavage) {
        Mail::to($lavage->client->email)->send(new VetementsEnLavageMail($lavage));
    }

    $lavagesRetirer = $lavage->vetements->every(fn($v) => $v->etat === 'Retiré');

    if ($lavagesRetirer) {
        Mail::to($lavage->client->email)->send(new VetementsRetirerMail($lavage));
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
    ->with(['categorie', 'type','lavage.consigne'])
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
