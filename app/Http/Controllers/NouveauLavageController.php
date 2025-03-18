<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Categorie;
use App\Models\Consigne;
use App\Models\Vetement;
use App\Models\Type;
use App\Models\Lavage;
use App\Models\Kilogramme;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

use App\Models\Structure;


class NouveauLavageController extends Controller
{
    public function nouveauLavage()
{
    // ✅ Vérifier si un acteur (réceptionniste) est connecté
    $acteur = Auth::guard('web')->user(); // 'web' correspond au guard des acteurs

    if (!$acteur) {
        return redirect()->route('acteurs.login')->withErrors('Aucun acteur connecté.');
    }

    // ✅ Récupérer l'ID de la structure de l'acteur connecté
    $structureId = $acteur->structure_id;

    // ✅ Sélectionner les clients, catégories et types liés à cette structure
    $clients = Client::where('structure_id', $structureId)->get();
    $categories = Categorie::where('structure_id', $structureId)->get();
    $types = Type::where('structure_id', $structureId)->get();
    $consignes = Consigne::where('structure_id', $structureId)->get();

    // ✅ Envoyer les données au frontend via Inertia
    return Inertia::render('NouveauLavage', [
        'clients' => $clients,
        'categories' => $categories,
        'types' => $types,
        'consignes' => $consignes,

    ]);
}
    public function create()
    {
        // Récupérer les données nécessaires depuis la base de données
        $clients = Client::all(); // Liste des clients
        $categories = Categorie::all(); // Liste des catégories de vêtements
        $types = Type::all(); // Liste des types de vêtements

        // Renvoyer une vue Inertia avec les données injectées
        return Inertia::render('NouveauLavage', [
            'clients' => $clients,
            'categories' => $categories,
            'types' => $types,
        ]);
    }

    public function store(Request $request)
    {
        Log::info('📩 Données reçues :', $request->all());
    
        // ✅ Récupérer l'acteur connecté
        $acteur = Auth::guard('web')->user();
    
        // ✅ Validation des données reçues
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'vetements' => 'required|array',
            'vetements.*.categorie_id' => 'required|exists:categories,id',
            'vetements.*.type_id' => 'required|exists:types,id',
            'vetements.*.couleur' => 'required|string',
            'consigne_id' => 'required|exists:consignes,id',
            'kilogrammes' => 'nullable|numeric',
        ]);
    
        Log::info('✅ Données validées :', $validated);
    
        // 🔥 Générer un code de retrait unique
        $codeRetrait = strtoupper(Str::random(6));
    
        // 🔍 Récupérer la consigne complète
        $consigne = Consigne::findOrFail($validated['consigne_id']);
        $pourcentageConsigne = $consigne->pourcentage_variation / 100;
    
        $tarifTotal = 0; 
    
        // 🏋️‍♂️ Facturation en kilogrammes
        if (!empty($validated['kilogrammes'])) {
            $tarifKg = Kilogramme::where('min_kg', '<=', $validated['kilogrammes'])
                ->where('max_kg', '>=', $validated['kilogrammes'])
                ->value('tarif');
    
            if (!$tarifKg) {
                return back()->withErrors(['kilogrammes' => '❌ Aucune plage de kilogrammes ne correspond.']);
            }
    
            $prix = $tarifKg * $validated['kilogrammes'];
            $tarifTotal = $prix + ($prix * $pourcentageConsigne);
        } else {
            foreach ($validated['vetements'] as $vetement) {
                $categorie = Categorie::findOrFail($vetement['categorie_id']);
                $type = Type::findOrFail($vetement['type_id']);
    
                $prixVetement = $categorie->tarif_base + ($categorie->tarif_base * $type->pourcentage_variation / 100);
                $tarifTotal += $prixVetement;
            }
    
            $tarifTotal += $tarifTotal * $pourcentageConsigne;
        }
    
        // 📝 Création du lavage
        $lavage = Lavage::create([
            'client_id' => $validated['client_id'],
            'code_retrait' => $codeRetrait,
            'receptionniste_id' => Auth::guard('web')->id(),
            'consigne_id' => $validated['consigne_id'],
            'kilogrammes' => $validated['kilogrammes'] ?? null,
            'tarif_total' => $tarifTotal,
        ]);
    
        Log::info("✅ Lavage enregistré - ID: {$lavage->id}, Code: {$codeRetrait}, Tarif: {$tarifTotal} FCFA");
    
        // 🛍️ Création des vêtements
        foreach ($validated['vetements'] as $vetement) {
            $categorie = Categorie::findOrFail($vetement['categorie_id']);
            $type = Type::findOrFail($vetement['type_id']);
    
            $prixVetement = null;
            if (empty($validated['kilogrammes'])) {
                $prixVetement = $categorie->tarif_base + ($categorie->tarif_base * $type->pourcentage_variation / 100);
            }
    
            Vetement::create([
                'lavage_id' => $lavage->id,
                'categorie_id' => $vetement['categorie_id'],
                'type_id' => $vetement['type_id'],
                'couleur' => $vetement['couleur'],
                'tarif' => $prixVetement,
            ]);
        }
    
        // ✅ Récupérer la structure associée à l'acteur connecté
        $structure = Structure::where('id', $acteur->structure_id)->first();
    
        // ✅ Retourner toutes les informations nécessaires
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
    

    



  
    
    public function showLastLavage()
    {
        // ✅ Récupérer l'acteur connecté
        $acteur = Auth::guard('web')->user();
    
        if (!$acteur) {
            return redirect()->route('acteurs.login')->with('error', 'Veuillez vous connecter.');
        }
    
        // ✅ Récupérer la structure liée à l'acteur connecté
        $structure = Structure::where('id', $acteur->structure_id)->first();
    
        // ✅ Récupérer le dernier lavage avec relations
        $lavage = Lavage::with(['client', 'vetements.categorie', 'vetements.type'])
            ->orderBy('created_at', 'desc')
            ->first();
    
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

}
