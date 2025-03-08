<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    public function handle(Request $request, Closure $next, $guard = null)
    {
        // 🔍 Vérifie si l'utilisateur est authentifié
        if (!Auth::guard($guard)->check()) {
            // 🎯 Déterminer la redirection en fonction du guard
            if ($guard === 'structure') {
                return redirect('/structure/login'); // Rediriger vers login structures
            }
            return redirect('/'); // Rediriger vers login acteurs
        }

        return $next($request);
    }
}
