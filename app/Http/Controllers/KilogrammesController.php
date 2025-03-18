<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Kilogramme;
use Illuminate\Support\Facades\Auth;

class KilogrammesController extends Controller
{
    public function index()
    {
        $structure = Auth::guard('structure')->user(); // Récupère la structure connectée
        $kilogramme = Kilogramme::where('structure_id', $structure->id)->where('actif', 'O')->get();

        return inertia('Kilogrammes', [
            'kilogrammes' => $kilogramme,
            'structure' => $structure,
        ]); 
    }

    public function store(Request $request)
{
    $request->validate([
        'min_kg' => 'required|numeric|min:0',
        'max_kg' => 'required|numeric|gt:min_kg',
        'tarif' => 'required|numeric|min:0',
    ]);
// Récupérer l'ID de la structure connectée
$structureId = Auth::guard('structure')->id();

// Vérifier si une plage existe déjà dans cet intervalle pour la même structure
$existingRange = Kilogramme::where('structure_id', $structureId)
    ->where(function ($query) use ($request) {
        $query->whereBetween('min_kg', [$request->min_kg, $request->max_kg])
              ->orWhereBetween('max_kg', [$request->min_kg, $request->max_kg])
              ->orWhere(function ($query) use ($request) {
                  $query->where('min_kg', '<=', $request->min_kg)
                        ->where('max_kg', '>=', $request->max_kg);
              });
    })->exists();



    if ($existingRange) {
        return redirect()->back()->with('error', '❌ Cette plage de kilogrammes existe déjà.');
    }

    // Vérifier si une valeur appartient déjà à une autre plage
    $valueExists = Kilogramme::where('structure_id', $structureId)
        ->where(function ($query) use ($request) {
            $query->whereBetween('min_kg', [$request->min_kg, $request->max_kg])
                  ->orWhereBetween('max_kg', [$request->min_kg, $request->max_kg])
                  ->orWhereRaw('? BETWEEN min_kg AND max_kg', [$request->min_kg])
                  ->orWhereRaw('? BETWEEN min_kg AND max_kg', [$request->max_kg]);
        })->exists();

    if ($valueExists) {
        return redirect()->back()->with('error', '⚠️ Un des kilogrammes entrés appartient déjà à une plage existante.');
    }

    Kilogramme::create([
        'min_kg' => $request->min_kg,
        'max_kg' => $request->max_kg,
        'tarif' => $request->tarif,
        'actif' => 'O',
        'structure_id' => $structureId,
    ]);

    return redirect()->back()->with('success', '✅ Plage ajoutée avec succès.');
}
    public function update(Request $request, $id)
    {
        $request->validate([
           'min_kg' => 'required|numeric',
           'max_kg' => 'required|numeric',
           'tarif' => 'required|numeric',
        ]);

        $Kilogramme = Kilogramme::findOrFail($id);
        $Kilogramme->update([
            'max_kg'=> $request->max_kg,
            'min_kg'=> $request->min_kg,
            'tarif'=> $request->tarif,
        ]);

        return redirect()->back();
    }

    public function destroy($id)
    {
        $consigne = Kilogramme::findOrFail($id);
        $consigne->update(['actif' => 'N']); // ⚠️ Met à jour au lieu de supprimer

        return redirect()->back()->with('success', 'Emplacement désactivé avec succès.');
    }
}
