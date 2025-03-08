<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Authentication Defaults
    |--------------------------------------------------------------------------
    |
    | Ici, on définit le guard et le système de récupération de mot de passe
    | par défaut. Nous utilisons "structure" comme authentification principale.
    |
    */

    'defaults' => [
        'guard' => 'structure',  // ✅ Par défaut, on utilise l'authentification d'une structure
        'passwords' => 'structures',
    ],

    /*
    |--------------------------------------------------------------------------
    | Authentication Guards
    |--------------------------------------------------------------------------
    |
    | Chaque guard correspond à un type d'utilisateur qui peut se connecter.
    | Nous avons ici deux guards : `structure` et `acteur`.
    |
    */

    'guards' => [
        'structure' => [
            'driver' => 'session',
            'provider' => 'structures',
        ],

        'web' => [
            'driver' => 'session',
            'provider' => 'acteurs',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | User Providers
    |--------------------------------------------------------------------------
    |
    | Ici, on configure comment récupérer les utilisateurs depuis la base de données.
    | Nous avons deux modèles : `Structure` et `Acteur`.
    |
    */

    'providers' => [
        'structures' => [
            'driver' => 'eloquent',
            'model' => App\Models\Structure::class, // ✅ Modèle Structure
        ],

        'acteurs' => [
            'driver' => 'eloquent',
            'model' => App\Models\Acteur::class, // ✅ Modèle Acteur
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Resetting Passwords
    |--------------------------------------------------------------------------
    |
    | Laravel permet de gérer les réinitialisations de mots de passe.
    | On configure ici les tables de réinitialisation pour chaque type d'utilisateur.
    |
    */

    'passwords' => [
        'structures' => [
            'provider' => 'structures',
            'table' => 'password_reset_tokens',
            'expire' => 60,
            'throttle' => 60,
        ],

        'acteurs' => [
            'provider' => 'acteurs',
            'table' => 'password_reset_tokens',
            'expire' => 60,
            'throttle' => 60,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Password Confirmation Timeout
    |--------------------------------------------------------------------------
    |
    | Temps avant qu'un utilisateur doive reconfirmer son mot de passe.
    |
    */

    'password_timeout' => 10800, // 3 heures
];
