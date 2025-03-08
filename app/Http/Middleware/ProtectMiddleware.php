<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProtectMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        // Vérifier si l'utilisateur est une structure
        if (Auth::guard('structure')->check()) {
            if (in_array('structure', $roles)) {
                return $next($request);
            }
        } 
        
        // Vérifier si l'utilisateur est un acteur (laveur, repasseur, réceptionniste)
        elseif (Auth::guard('web')->check()) {
            $user = Auth::guard('web')->user();
            if (in_array($user->role, $roles)) {
                return $next($request);
            }
        }

        // Si l'utilisateur n'est pas connecté, rediriger vers la bonne page de connexion
        return redirect()->route($this->getLoginRoute($roles));
    }

    /**
     * Détermine la route de connexion appropriée.
     */
    private function getLoginRoute($roles)
    {
        if (in_array('structure', $roles)) {
            return 'structure.login'; // 🔹 Route pour les structures
        }

        return 'acteurs.login'; // 🔹 Route pour les acteurs (laveur, repasseur, réceptionniste)
    }
}
