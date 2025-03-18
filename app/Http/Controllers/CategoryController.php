<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Categorie;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    public function index()
    {
        $structure = Auth::guard('structure')->user(); // Récupère la structure connectée
        $categories = Categorie::where('structure_id', $structure->id)->where('actif', 'O')->get();

        return inertia('Categories', [
            'categories' => $categories,
            'structure' => $structure,
        ]);
    }

    public function store(Request $request)
{
    $request->validate([
        'nom' => 'required|string|max:255',
        'tarif_base' => 'required|numeric',
    ]);

    $structure_id = Auth::guard('structure')->id(); // ✅ Récupérer la structure connectée

    if (!$structure_id) {
        return back()->withErrors(['error' => 'Aucune structure connectée.']);
    }

    Categorie::create([
        'nom' => $request->nom,
        'tarif_base' => $request->tarif_base,
        'structure_id' => $structure_id, // ✅ Associer à la structure connectée
    ]);

    

    return redirect()->back();
}
    public function update(Request $request, $id)
    {
        $request->validate([
            'tarif_base' => 'required|numeric',
        ]);

        $category = Categorie::findOrFail($id);
        $category->update(['tarif_base' => $request->tarif_base]);

        return redirect()->back();
    }

    public function destroy($id)
    {
        $category = Categorie::findOrFail($id);
        $category->update(['actif' => 'N']); // ⚠️ Met à jour au lieu de supprimer

        return redirect()->back()->with('success', 'Emplacement désactivé avec succès.');
    }
}
