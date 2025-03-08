<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Acteur;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Affiche le formulaire de connexion.
     */
    public function showStructureLogin()
{
    return Inertia::render('LoginStructure');
}

public function showActeursLogin()
{
    return Inertia::render('Login');
}

    /**
     * Gère la connexion de l'utilisateur.
     */
    public function login(Request $request)
    {
        // Valider les données du formulaire
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

       // 🔥 Authentifier avec le guard 'structure'
       if (Auth::guard('web')->attempt($request->only('email', 'password'))) {
        $request->session()->regenerate();

        // ✅ Récupérer l'acteur connecté
        $acteur = Auth::guard('web')->user();

        // 🎯 Redirection en fonction du rôle
        switch ($acteur->role) {
            case 'repasseur':
                return redirect()->route('Admin'); // Route pour admin
            case 'receptionniste':
                return redirect()->route('Receptionniste'); // Route pour user
            case 'laveur':
                return redirect()->route('laveur'); // Route pour acteur
        }
    }

        // Si les identifiants sont incorrects
        return back()->withErrors([
            'email' => 'Email ou mot de passe incorrect.',
        ]);
    }

    /**
     * Déconnexion de l'utilisateur.
     */
    public function logout(Request $request)
{
    // ✅ Vérifier quel type d'utilisateur est connecté
    if (Auth::guard('web')->check()) {
        Auth::guard('web')->logout(); // Déconnecter l'acteur (réceptionniste, repasseur, etc.)
    } elseif (Auth::guard('structure')->check()) {
        Auth::guard('structure')->logout(); // Déconnecter la structure
    }

    // ✅ Invalider la session et régénérer le token CSRF
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    // ✅ Redirection vers la page de connexion
    return redirect('/bienvenue');
}
}
