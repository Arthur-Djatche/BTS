<?php

namespace App\Http\Controllers;
use App\Models\Vetement;
use App\Models\Lavage;

use Illuminate\Http\Request;

class LavageController extends Controller
{
    public function index()
{
    // Récupérez les lavages avec leurs relations (client et vêtements)
    $lavages = Lavage::with(['client', 'vetements'])->get();

    // Envoyez les données au frontend via Inertia
    return inertia('EtatLavage', [
        'lavages' => $lavages,
    ]);
}

public function retirer(Lavage $lavage)
{
    $lavage->update(['etat' => 'Retiré']);
    $lavage->vetements()->update(['etat' => 'Retiré']);
    return back()->with('success', 'Lavage marqué comme retiré.');
}

public function details(Lavage $lavage)
{
    $lavage->load('client', 'vetements.categorie', 'vetements.type');
    return inertia('DetailsVetements', compact('lavage'));
}

}
