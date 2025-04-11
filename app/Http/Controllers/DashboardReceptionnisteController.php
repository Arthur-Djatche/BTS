<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use App\Models\Lavage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Models\Acteur;

use Illuminate\Http\Request;

class DashboardReceptionnisteController extends Controller
{
    public function index()
    {
        $receptionniste = Auth::guard('web')->user(); // utilisateur connecté
    
        $today = now()->toDateString(); // Récupère la date du jour : 'YYYY-MM-DD'
    
        $lavages = Lavage::where('receptionniste_id', $receptionniste->id)->get();
    
        $lavagesToday = $lavages->filter(function ($lavage) use ($today) {
            return $lavage->created_at->toDateString() === $today;
        });
    
        return Inertia::render('DashboardReceptionniste', [
            'lavages_en_cours' => $lavages->where('status', 'Non payé')->count(),
            'lavages_termines' => $lavages->where('status', 'Payé')->count(),
            'total_tarifs' => $lavagesToday->sum('tarif_total'), // ✅ Total du jour
            'vetements_etiquettage' => \App\Models\Vetement::where('etat', 'etiquettage')->count(),
            'receptionniste' => $receptionniste,
        ]);
    }
    
}
