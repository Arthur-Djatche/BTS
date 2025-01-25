<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        // Vérifie si l'utilisateur est authentifié
        if (!Auth::check()) {
            return redirect('/')->withErrors(['error' => 'Vous devez être connecté.']);
        }

        // Vérifie si l'utilisateur a l'un des rôles autorisés
        $user = Auth::user();
        if (!in_array($user->role, $roles)) {
            return redirect('/unauthorized')->withErrors(['error' => 'Accès non autorisé.']);
        }

        return $next($request);
    }
}
