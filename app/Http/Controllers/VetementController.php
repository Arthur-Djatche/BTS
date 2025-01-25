<?php

namespace App\Http\Controllers;
use App\Models\Vetement;
use App\Models\Lavage;

use Illuminate\Http\Request;

class VetementController extends Controller
{
    public function retirer(Vetement $vetement)
{
    $vetement->update(['etat' => 'Retiré']);
    return back()->with('success', 'Vêtement marqué comme retiré.');
}

public function updateEtat(Request $request, $id)
{
    $validated = $request->validate([
        'etat' => 'required|in:En lavage,En repassage,Terminé,Retiré',
    ]);

    $vetement = Vetement::findOrFail($id);
    $vetement->etat = $validated['etat'];
    $vetement->save();

    return redirect()->back()->with('success', 'État du vêtement mis à jour avec succès.');
}

public function index()
{
    $vetements = Vetement::where('etat', 'En lavage')->with('categorie', 'type')->get();

    return inertia('TacheLavages', [
        'vetements' => $vetements,
    ]);
}

}
