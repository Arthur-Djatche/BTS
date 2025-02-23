<?php

namespace App\Http\Controllers;

use App\Models\Lavage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
class FactureController extends Controller
{
    public function show($id)
    {
        // Récupérer le lavage avec les vêtements et le client
        $lavage = Lavage::with(['vetements.categorie', 'vetements.type', 'client'])->find($id);

        if (!$lavage) {
            return redirect()->route('etat_lavage')->with('error', 'Lavage non trouvé.');
        }

        return Inertia::render('Facture', ['lavage' => $lavage]);
    }
}
