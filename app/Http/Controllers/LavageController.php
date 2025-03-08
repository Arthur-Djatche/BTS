<?php

namespace App\Http\Controllers;
use App\Models\Vetement;
use App\Models\Lavage;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class LavageController extends Controller
{
    public function index()
{
    // ✅ Vérifier si un réceptionniste est connecté via le guard 'web' (Acteurs)
    $receptionniste = Auth::guard('web')->user(); 

    if (!$receptionniste || $receptionniste->role !== 'receptionniste') {
        return redirect('/')->withErrors('Aucun réceptionniste connecté.');
    }

    // ✅ Récupérer l'ID de la structure du réceptionniste connecté
    $structureId = $receptionniste->structure_id;

    // ✅ Récupérer les lavages liés à ce réceptionniste ou à sa structure
    $lavages = Lavage::with(['client', 'vetements'])
        ->where(function ($query) use ($receptionniste, $structureId) {
            $query->where('receptionniste_id', $receptionniste->id) // Lavages créés par lui-même
                  ->orWhereHas('receptionniste', function ($query) use ($structureId) {
                      $query->where('structure_id', $structureId); // Lavages d'autres réceptionnistes de sa structure
                  });
        })
        ->get();

    // ✅ Retourner les données avec Inertia
    return inertia('EtatLavage', [
        'lavages' => $lavages,
    ]);
}

public function updateEmplacement(Request $request, $id)
{
    $request->validate([
        'emplacement_id' => 'required|exists:emplacements,id',
    ]);

    $lavage = Lavage::findOrFail($id);
    $lavage->emplacement_id = $request->emplacement_id;
    $lavage->save();

    return back()->with('success', 'Emplacement mis à jour.');
}
public function getLavagesTermines()
{  
    $acteur = Auth::guard('web')->user();
    if (!$acteur) {
        return redirect()->route('acteurs.login');
    }

    $structureId = $acteur->structure_id;

     // Récupérer les lavages dont tous les vêtements sont terminés
     $lavagesTermines = Lavage::whereDoesntHave('vetements', function ($query) {
        $query->where('etat', '!=', 'Terminé');
    }) // Vérifie que tous les vêtements sont terminés
    ->whereNull('emplacement_id') // Vérifie que l'emplacement_id est NULL
    ->whereHas('receptionniste', function ($subQuery) use ($structureId) {
        $subQuery->where('structure_id', $structureId);
    })
    ->get();
}


public function retirer(Lavage $lavage)
{
    $lavage->update(['etat' => 'Retiré']);
    $lavage->vetements()->update(['etat' => 'Retiré']);
    return back()->with('success', 'Lavage marqué comme retiré.');
}

public function details(Lavage $lavage)
{
    $lavage->load('client', 'vetements.categorie', 'vetements.type');
    return inertia('DetailsVetements', compact('lavage'));
}
public function dernierLavage()
{
    // Récupérer le dernier lavage enregistré avec ses vêtements
    $dernierLavage = Lavage::with('vetements')
        ->latest('created_at') // Trier par date de création
        ->first();

    if (!$dernierLavage) {
        return response()->json(['message' => 'Aucun lavage trouvé'], 404);
    }

    return response()->json(['lavage' => $dernierLavage]);
}

public function verifierCodeRetrait(Request $request)
{
    $validated = $request->validate([
        'lavage_id' => 'required|exists:lavages,id',
        'code_retrait' => 'required|string',
    ]);

    $lavage = Lavage::find($validated['lavage_id']);

    if (!$lavage) {
        return response()->json(['valid' => false, 'message' => "Lavage introuvable."], 404);
    }

    if (strtolower(trim($lavage->code_retrait)) === strtolower(trim($validated['code_retrait']))) {
        return response()->json(['valid' => true]);
    } else {
        return response()->json(['valid' => false, 'message' => "Code incorrect."], 200);
    }
}


}
