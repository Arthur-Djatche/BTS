<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Structure;
use Illuminate\Support\Facades\Auth;

class StructureController extends Controller
{
    public function store(Request $request)
{
    $validated = $request->validate([
        'nom_structure' => 'required|string|max:255',
        'nom_admin' => 'required|string|max:255',
        'ville' => 'required|string|max:255',
        'email' => 'required|email|unique:structures,email',
        'telephone' => 'required|string|max:20|unique:structures,telephone',
        'password' => 'required|string|min:6|confirmed',
    ]);

    // Création de la structure
    Structure::create([
        'nom_structure' => $validated['nom_structure'],
        'nom_admin' => $validated['nom_admin'],
        'ville' => $validated['ville'],
        'email' => $validated['email'],
        'telephone' => $validated['telephone'],
        'password' => bcrypt($validated['password']),
    ]);

    return redirect()->back()->with('success', 'Structure créée avec succès !');
}
public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 🔥 Authentifier avec le guard 'structure'
        if (Auth::guard('structure')->attempt($request->only('email', 'password'))) {
            $request->session()->regenerate();
            return redirect()->route('Admin'); // Rediriger vers le tableau de bord
        }

        return back()->withErrors(['email' => 'Identifiants incorrects']);
    }


    public function logout()
    {
        session()->forget('structure_id');
        return redirect('/')->with('success', 'Déconnexion réussie.');
    }
}
