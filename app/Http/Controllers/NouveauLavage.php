<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Categorie;
use App\Models\Type;
use Inertia\Inertia;

class NouveauLavage extends Controller
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
}
