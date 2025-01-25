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

        // Création d'un lavage
        $lavage = Lavage::create([
            'client_id' => $validated['client_id'],
        ]);

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

        // return redirect()->route('/receptionniste/nouveau-lavage')->with('success', 'Lavage enregistré avec succès.');
}



public function showLastLavage()
{
    $lavage = Lavage::with(['client', 'vetements.categorie', 'vetements.type'])
        ->latest()
        ->first();

    return inertia('Facture', [
        'lavage' => $lavage,
    ]);
}

}
