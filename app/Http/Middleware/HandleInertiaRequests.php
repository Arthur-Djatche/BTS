<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            // Partage des informations utilisateur
            'auth' => [
                'user' => $request->user(),
            ],

            // Messages de session
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],

            // Partage des rôles (si disponibles)
            'roles' => ['admin', 'laveur', 'repasseur'], // Modifier si dynamique
        ]);
    }
}
