<?php

namespace App\Http\Controllers;

use App\Models\Lavage;
use App\Models\Vetement;
use App\Models\Structure;
use App\Models\Acteur;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class SuperDashboardController extends Controller
{
    public function index()
    {
        // 📌 Nombre total de structures
        $totalStructures = Structure::count();

        // 📌 Nombre total d'employés (tous les acteurs sauf super admin)
        $totalEmployes = Acteur::where('role', '!=', 'super_admin')->count();

        // 📌 Structure réalisant le plus de lavages
        $structureTop = Structure::withCount('lavages')
            ->orderByDesc('lavages_count')
            ->first();

        // 📌 Structures inscrites au cours des 6 derniers mois
        $structuresParMois = Structure::selectRaw('COUNT(id) as total, MONTH(created_at) as mois')
            ->whereYear('created_at', Carbon::now()->year)
            ->groupBy('mois')
            ->orderBy('mois')
            ->get()
            ->pluck('total', 'mois');

        return Inertia::render('DashboardSuper', [
            'stats' => [
                'totalStructures' => $totalStructures,
                'totalEmployes' => $totalEmployes,
                'structureTop' => $structureTop ? $structureTop->nom_structure : 'Aucune',
            ],
            'charts' => [
                'structuresParMois' => $structuresParMois,
            ],
        ]);
    }
}

