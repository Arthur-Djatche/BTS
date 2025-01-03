<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Acteur;


class AuthController extends Controller
{
    /**
     * Affiche le formulaire de connexion.
     */
    public function showLoginForm()
    {
        return view('Login'); // Remplacez par votre vue de connexion
    }

    /**
     * Gère la connexion de l'utilisateur.
     */
    public function login(Request $request)
    {
        // Valider les données du formulaire
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:8',
        ]);

        // Vérifier les identifiants
        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            // Rediriger en fonction du rôle
            switch ($user->role) {
                case 'admin':
                    return redirect()->route('Admin'); // Route pour admin
                case 'user':
                    return redirect()->route('user.dashboard'); // Route pour user
                case 'acteur':
                    return redirect()->route('acteur.dashboard'); // Route pour acteur
                default:
                    Auth::logout();
                    return redirect()->route('login')->with('error', 'Rôle non reconnu.');
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
    public function logout()
    {
        Auth::logout();
        return redirect()->route('/');
    }
}
