<?php

namespace App\Http\Controllers;
use App\Models\Vetement;
use App\Models\Lavage;

use Illuminate\Http\Request;


class LavageController extends Controller
{
    public function index()
{
    // Récupérez les lavages avec leurs relations (client et vêtements)
    $lavages = Lavage::with(['client', 'vetements'])->get();

    // Envoyez les données au frontend via Inertia
    return inertia('EtatLavage', [
        'lavages' => $lavages,
    ]);
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
