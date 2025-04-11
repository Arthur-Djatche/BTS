<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Models\Vetement;
use App\Models\Lavage;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardRepasseurController extends Controller
{
    public function index()
    {
        $repasseur = Auth::guard('web')->user();
        if (!$repasseur) {
            return redirect()->route('acteurs.login')->with('error', 'Veuillez vous connecter.');
        }

        // Nombre de vêtements en lavage pour sa structure
        $en_repassage = Vetement::where('etat', 'En repassage')
            ->whereHas('lavage.receptionniste', function ($query) use ($repasseur) {
                $query->where('structure_id', $repasseur->structure_id);
            })
            ->count();

        // Nombre de vêtements déjà lavés par ce laveur
        $repasses = Vetement::where('repasseur_id', $repasseur->id)
            ->whereIn('etat', ['En repassage', 'Terminé', 'Retiré'])
            ->count();

        // Statistiques journalières
        $stats_journalieres = Vetement::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('count(*) as total')
            )
            ->where('repasseur_id', $repasseur->id)
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date', 'desc')
            ->limit(7)
            ->get();

        return Inertia::render('DashboardRepasseur', [
            'en_repassage' => $en_repassage,
            'repasses' => $repasses,
            'stats_journalieres' => $stats_journalieres,
        ]);
    }
}
