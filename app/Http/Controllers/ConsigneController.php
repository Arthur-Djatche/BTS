<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Consigne;

class ConsigneController extends Controller
{
    public function index()
    {
        $structure = Auth::guard('structure')->user(); // Récupère la structure connectée
        $consignes = Consigne::where('structure_id', $structure->id)->get();

        return inertia('Consignes', [
            'consignes' => $consignes,
            'structure' => $structure,
        ]); 
    }

    public function store(Request $request)
{
    $request->validate([
        'nom' => 'required|string|max:255',
        'priorite_consigne' => 'required|string|max:255',
        'pourcentage_variation' => 'required|numeric',
        'type_consigne' => 'required|string',
    ]);

    $structure_id = Auth::guard('structure')->id(); // ✅ Récupérer la structure connectée

    if (!$structure_id) {
        return back()->withErrors(['error' => 'Aucune structure connectée.']);
    }

    Consigne::create([
        'nom' => $request->nom,
        'priorite_consigne' => $request->priorite_consigne,
        'pourcentage_variation' => $request->pourcentage_variation,
        'type_consigne' => $request->type_consigne,
        'actif' => 'O',
        'structure_id' => $structure_id, // ✅ Associer à la structure connectée
    ]);

    

    return redirect()->back();
}
    public function update(Request $request, $id)
    {
        $request->validate([
            'pourcentage_variation' => 'required|numeric',
        ]);

        $consigne = Consigne::findOrFail($id);
        $consigne->update(['pourcentage_variation' => $request->pourcentage_variation]);

        return redirect()->back();
    }

    public function destroy($id)
    {
        $consigne = Consigne::findOrFail($id);
        $consigne->update(['actif' => 'N']); // ⚠️ Met à jour au lieu de supprimer

        return redirect()->back()->with('success', 'Emplacement désactivé avec succès.');
    }
    public function restore($id)
    {
        $consigne = Consigne::findOrFail($id);
        $consigne->update(['actif' => 'O']); // ⚠️ Met à jour au lieu de supprimer

        return redirect()->back()->with('success', 'Emplacement Activé avec succès.');
    }
}
