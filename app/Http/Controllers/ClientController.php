<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;
use Illuminate\Support\Facades\Auth;

class ClientController extends Controller
{
    public function store(Request $request)
{
    // Récupérer l'utilisateur connecté sous le guard 'web'
    $acteur = Auth::guard('web')->user();

    if (!$acteur) {
        return redirect()->route('acteurs.login')->with('error', 'Veuillez vous connecter.');
    }

    // Récupérer l'ID de la structure
    $structureId = $acteur->structure_id ?? null;

    if (!$structureId) {
        return back()->with('error', 'Aucune structure associée.');
    }

    // Insérer le client avec la structure_id
    Client::create([
        'nom' => $request->nom,
        'prenom' => $request->prenom,
        'email' => $request->email,
        'telephone' => $request->telephone,
        'structure_id' => $structureId, // ✅ Ajout de la structure_id
    ]);

    return redirect()->back()->with('success', 'Client ajouté avec succès.');
}
}