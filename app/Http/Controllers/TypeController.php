<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Type;
use Illuminate\Support\Facades\Auth;

class TypeController extends Controller
{
    public function index()
    {
        $structure = Auth::guard('structure')->user(); // Récupère la structure connectée
        $types = Type::where('structure_id', $structure->id)->where('actif', 'O')->get();

        return inertia('Types', [
            'types' => $types,
            'structure' => $structure,
        ]); 
    }

    public function store(Request $request)
{
    $request->validate([
        'nom' => 'required|string|max:255',
        'pourcentage_variation' => 'required|numeric',
    ]);

    $structure_id = Auth::guard('structure')->id(); // ✅ Récupérer la structure connectée

    if (!$structure_id) {
        return back()->withErrors(['error' => 'Aucune structure connectée.']);
    }

    Type::create([
        'nom' => $request->nom,
        'pourcentage_variation' => $request->pourcentage_variation,
        'structure_id' => $structure_id, // ✅ Associer à la structure connectée
    ]);

    

    return redirect()->back();
}
    public function update(Request $request, $id)
    {
        $request->validate([
            'pourcentage_variation' => 'required|numeric',
        ]);

        $type = Type::findOrFail($id);
        $type->update(['pourcentage_variation' => $request->pourcentage_variation]);

        return redirect()->back();
    }

    public function destroy($id)
    {
        $type = Type::findOrFail($id);
        $type->update(['actif' => 'N']); // ⚠️ Met à jour au lieu de supprimer

        return redirect()->back()->with('success', 'Emplacement désactivé avec succès.');
    }
}
