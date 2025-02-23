<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Categorie;
use App\Models\Vetement;
use App\Models\Type;
use App\Models\Lavage;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;


class NouveauLavageController extends Controller
{
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

          // Ajouter un log pour les données reçues
    Log::info('Données reçues :', $request->all());

        // Validation des données reçues
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'vetements' => 'required|array',
            'vetements.*.categorie_id' => 'required|exists:categories,id',
            'vetements.*.type_id' => 'required|exists:types,id',
            'vetements.*.couleur' => 'required|string',
        ]);
        Log::info('Données validées :', $validated);

        // Générer un code de retrait unique
    $codeRetrait = strtoupper(Str::random(6));

        // Création d'un lavage
        $lavage = Lavage::create([
            'client_id' => $validated['client_id'],
            'code_retrait' => $codeRetrait,
            // 'receptionniste_id' => Auth::id(), // ID du réceptionniste authentifié
        ]);

    Log::info('Lavage enregistré avec code de retrait :', ['id' => $lavage->id, 'code' => $lavage->code_retrait]);


        // Création des vêtements associés
        foreach ($validated['vetements'] as $vetement) {
            Vetement::create([
                'lavage_id' => $lavage->id,
                'client_id' => $validated['client_id'],
                'categorie_id' => $vetement['categorie_id'],
                'type_id' => $vetement['type_id'],
                'couleur' => $vetement['couleur'],
            ]);
        }

        Log::info('Lavage créé avec succès. ID du lavage :', ['lavage_id' => $lavage->id]);

        // return response()->json(['message' => 'Lavage enregistré avec succès', 'lavage_id' => $lavage->id], 200);
        return redirect()->route('facture', ['lavage_id' => $lavage->id])->with([
            'message' => 'Lavage enregistré avec succès !',
            'lavage_id' => $lavage->id
        ]);
    }



public function showLastLavage()
{
    $lavage = Lavage::with(['client', 'vetements.categorie', 'vetements.type'])
        ->orderBy('created_at', 'desc')
        ->first();

    return inertia('Facture', [
        'lavage' => $lavage,
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
