<?php

namespace App\Http\Controllers;

use App\Models\Lavage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Models\Structure;
use Illuminate\Support\Facades\Auth;
class FactureController extends Controller
{
    public function show($id)

    {  
         $acteur = Auth::guard('web')->user();
    
        if (!$acteur) {
            return redirect()->route('acteurs.login')->with('error', 'Veuillez vous connecter.');
        }
        // Récupérer le lavage avec les vêtements et le client
        $lavage = Lavage::with(['vetements.categorie', 'vetements.type', 'client'])->find($id);
          // ✅ Récupérer la structure liée à l'acteur connecté
        $structure = Structure::where('id', $acteur->structure_id)->first();

        if (!$lavage) {
            return redirect()->route('etat-lavage')->with('error', 'Lavage non trouvé.');
        }

        return Inertia::render('Facture', [
            'lavage' => $lavage->load([
                'client',
                'vetements.categorie',
                'vetements.type',
                'consigne', // 🔥 Ici on retourne la consigne complète !
                'receptionniste',
            ]),
            'message' => '✅ Lavage enregistré avec succès !',
            'acteur' => $acteur,
            'structure' => $structure ? [
                'nom_structure' => $structure->nom_structure,
                'telephone' => $structure->telephone,
                'ville' => $structure->ville,
                'email' => $structure->email,
            ] : null, 
        ]);
    }
}
