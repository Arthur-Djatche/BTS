<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Emplacement;
use Illuminate\Support\Facades\Auth;

class EmplacementController extends Controller
{
    public function index()
    {
        $structure = Auth::guard('structure')->user(); // Récupère la structure connectée
        
        // Sélectionner uniquement les emplacements actifs de la structure connectée
        $emplacements = Emplacement::where('structure_id', $structure->id)
                                   ->where('actif', 'O') // Condition pour les emplacements actifs
                                   ->get();
    
        return inertia('Emplacements', [
            'emplacements' => $emplacements,
            'structure' => $structure,
        ]); 
    }
    

    public function store(Request $request)
{
    $request->validate([
        'nom' => 'required|string|max:255',
    ]);

    $structure_id = Auth::guard('structure')->id(); // ✅ Récupérer la structure connectée

    if (!$structure_id) {
        return back()->withErrors(['error' => 'Aucune structure connectée.']);
    }

    Emplacement::create([
        'nom' => $request->nom,
        'structure_id' => $structure_id, // ✅ Associer à la structure connectée
    ]);

    

    return redirect()->back();
}
    public function update(Request $request, $id)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
        ]);

        $emplacement = Emplacement::findOrFail($id);
        $emplacement->update(['nom' => $request->nom]);

        return redirect()->back();
    }

    public function destroy($id)
    {
        $emplacement = Emplacement::findOrFail($id);
        $emplacement->update(['actif' => 'N']); // ⚠️ Met à jour au lieu de supprimer
    
        return redirect()->back()->with('success', 'Emplacement désactivé avec succès.');
    }
    
}
