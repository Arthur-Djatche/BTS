<?php

namespace App\Http\Controllers;

use App\Models\Lavage;
use App\Models\Vetement;
use App\Models\Structure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class StructureDashboardController extends Controller
{
    public function index()
    {
        // 🔍 Récupérer la structure de l'utilisateur connecté
        $structure = Auth::guard('structure')->user();

        // 📌 Vérifier si la structure existe
        if (!$structure) {
            return redirect()->route('login')->withErrors("Aucune structure trouvée.");
        }

        // 📅 Lavages d'aujourd'hui
        $lavagesAujourdhui = $structure->lavages()
    ->whereDate('lavages.created_at', Carbon::today()) // ✅ Ajout du préfixe `lavages.`
    ->count();

        // 📅 Total des vêtements traités aujourd'hui
        $vetementsAujourdhui = Vetement::whereHas('lavage', function ($query) use ($structure) {
            $query->whereHas('receptionniste', function ($subQuery) use ($structure) {
                $subQuery->where('structure_id', $structure->id);
            });
        })->whereDate('created_at', Carbon::today())->count();

        // 📊 Lavages par type de consigne (pie chart)
        $lavagesParConsigne = Lavage::selectRaw('COUNT(id) as total, consigne_id')
            ->whereHas('receptionniste', fn ($q) => $q->where('structure_id', $structure->id))
            ->groupBy('consigne_id')
            ->with('consigne:id,nom')
            ->get()
            ->map(fn ($item) => ['nom' => $item->consigne->nom, 'total' => $item->total]);

        // 📊 Lavages par mois (bar chart)
        $lavagesParMois = Lavage::selectRaw('COUNT(id) as total, MONTH(created_at) as mois')
            ->whereHas('receptionniste', fn ($q) => $q->where('structure_id', $structure->id))
            ->whereYear('created_at', Carbon::now()->year)
            ->groupBy('mois')
            ->orderBy('mois')
            ->get()
            ->pluck('total', 'mois');

        return Inertia::render('DashboardStructure', [
            'stats' => [
                'lavagesAujourdhui' => $lavagesAujourdhui,
                'vetementsAujourdhui' => $vetementsAujourdhui,
            ],
            'charts' => [
                'lavagesParMois' => $lavagesParMois,
                'lavagesParConsigne' => $lavagesParConsigne,
            ]
        ]);
    }
}
