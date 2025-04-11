<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Models\Vetement;
use App\Models\Lavage;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardLaveurController extends Controller
{
    public function index()
    {
        $laveur = Auth::guard('web')->user();
        if (!$laveur) {
            return redirect()->route('acteurs.login')->with('error', 'Veuillez vous connecter.');
        }

        // Nombre de vêtements en lavage pour sa structure
        $en_lavage = Vetement::where('etat', 'En lavage')
            ->whereHas('lavage.receptionniste', function ($query) use ($laveur) {
                $query->where('structure_id', $laveur->structure_id);
            })
            ->count();

        // Nombre de vêtements déjà lavés par ce laveur
        $laves = Vetement::where('laveur_id', $laveur->id)
            ->whereIn('etat', ['En repassage', 'Terminé', 'Retiré'])
            ->count();

        // Statistiques journalières
        $stats_journalieres = Vetement::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('count(*) as total')
            )
            ->where('laveur_id', $laveur->id)
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date', 'desc')
            ->limit(7)
            ->get();

        return Inertia::render('DashboardLaveur', [
            'en_lavage' => $en_lavage,
            'laves' => $laves,
            'stats_journalieres' => $stats_journalieres,
        ]);
    }
}
