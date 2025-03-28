<?php

namespace Database\Seeders;

use App\Models\Acteur;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // ✅ Créer le Super Admin s'il n'existe pas déjà
        Acteur::firstOrCreate([
            'email' => env('SUPER_ADMIN_EMAIL', 'wdows280@gmail.com'),
        ], [
            'nom' => 'Super',
            'prenom' => 'Admin',
            'telephone' => '697161277', // Valeur par défaut, modifiable
            'password' => Hash::make(env('SUPER_ADMIN_PASSWORD', 'superadminpassword')),
            'role' => 'super_admin',
            'actif' => true, // ✅ Activer le compte Super Admin
            'structure_id' => null, // ✅ Assurer que le Super Admin n'est rattaché à aucune structure
        ]);
    }
}
