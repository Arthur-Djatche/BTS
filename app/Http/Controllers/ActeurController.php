<?php
namespace App\Http\Controllers;

use App\Models\Acteur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class ActeurController extends Controller
{
    public function store(Request $request)
    {
        // Valider les données
        $validatedData = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:acteurs',
            'telephone' => 'nullable|string|max:20',
            'password' => 'required|string|min:8',
        ]);

        Log::info('Données validées : ', $validatedData);
        // dd($request->all());

        // Créer un nouvel acteur 
        Acteur::create([
            'nom' => $validatedData['nom'],
            'prenom' => $validatedData['prenom'],
            'email' => $validatedData['email'],
            'telephone' => $validatedData['telephone'],
            'password' => Hash::make($validatedData['password']),
            'role' => Acteur::count() === 0 ? 'admin' : 'admin', // Premier utilisateur = admin
        ]);

        // Log::info('Acteur créé : ', $acteur->toArray());

        return redirect('/'); 

        
    }
}
