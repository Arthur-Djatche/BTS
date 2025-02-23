<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Inertia\Inertia;

class HandleInertiaRequests extends Middleware
{
    // Vue racine de l’application
    public function rootView(Request $request): string
    {
        return 'app'; // Assurez-vous que cette vue existe bien dans resources/views/app.blade.php
    }

    // Gestion de la version des assets (nécessaire pour éviter les caches)
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    // Partage des données globales avec Inertia
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
            'roles' => ['admin', 'laveur', 'repasseur', 'receptionniste'], // À adapter selon ton app
        ]);
    }
}
