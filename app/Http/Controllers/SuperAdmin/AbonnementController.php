<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Abonnement;
use App\Models\Structure;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AbonnementController extends Controller
{
    public function index()
    {
        $structures = Structure::with('abonnement')->get();
        $abonnements = Abonnement::all();

        return Inertia::render('StructuresAbonnements', [
            'structures' => $structures,
            'abonnements' => $abonnements,
        ]);
    }
    public function index_abonnement()
    {
    
        $abonnements = Abonnement::where('actif', 'O')->get();

        return Inertia::render('Abonnements', [
         
            'abonnements' => $abonnements,
            'abonnementsInactifs' => Abonnement::where('actif', 'N')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'limite_lavages' => 'required|integer|min:0',
            'limite_consigne' => 'required|integer|min:0',
            'limite_categories' => 'required|integer|min:0',
            'limite_types' => 'required|integer|min:0',
            'prix' => 'required|numeric|min:0',
        ]);

        Abonnement::create($request->all());

        return redirect()->back()->with('success', 'Abonnement créé avec succès.');
    }

   // Assigner un abonnement à une structure
   public function assignerAbonnement(Request $request, Structure $structure)
   {
       $request->validate([
           'abonnement_id' => 'nullable|exists:abonnements,id'
       ]);

       $structure->abonnement_id = $request->abonnement_id;
       $structure->save();

       return redirect()->back()->with('success', 'Abonnement mis à jour avec succès.');
   }
   public function toggleActivation(Structure $structure)
   {
       $structure->actif = $structure->actif === 'O' ? 'N' : 'O';
       $structure->save();

       return redirect()->back()->with('success', 'Statut de la structure mis à jour.');
   }

   public function update(Request $request, $id)
   {
       $request->validate([
           'limite_lavages' => 'required|integer|min:0',
           'limite_consigne' => 'required|integer|min:0',
           'limite_categories' => 'required|integer|min:0',
           'limite_types' => 'required|integer|min:0',
       ]);

       $abonnement = Abonnement::findOrFail($id);
       $abonnement->update($request->only(['limite_lavages', 'limite_consigne', 'limite_categories', 'limite_types']));

       return redirect()->route('abo');

   }
   public function disable($id)
    {
        $abonnement = Abonnement::findOrFail($id);
        $abonnement->update(['actif' => 'N']);
    

        return redirect()->route('abo');
    }

    /**
     * Restaurer un abonnement (passer 'actif' à 'O')
     */
    public function restore($id)
    {
        $abonnement = Abonnement::findOrFail($id);
        $abonnement->update(['actif' => 'O']);

        return redirect()->route('abo');
    }
}
