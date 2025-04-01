<?php

namespace App\Http\Controllers;
use App\Models\Vetement;
use App\Models\Lavage;
use App\Models\Client;
use App\Models\Categorie;
use App\Models\Type;
use App\Models\Consigne;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Mail\VetementsRetirerMail;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;


class LavageController extends Controller
{
    public function index()
{
    // ✅ Vérifier si un réceptionniste est connecté via le guard 'web' (Acteurs)
    $receptionniste = Auth::guard('web')->user(); 

    if (!$receptionniste || $receptionniste->role !== 'receptionniste') {
        return redirect('/')->withErrors('Aucun réceptionniste connecté.');
    }

    // ✅ Récupérer l'ID de la structure du réceptionniste connecté
    $structureId = $receptionniste->structure_id;

    // ✅ Récupérer les lavages liés à ce réceptionniste ou à sa structure
    $lavages = Lavage::with(['client', 'vetements'])
        ->where(function ($query) use ($receptionniste, $structureId) {
            $query->where('receptionniste_id', $receptionniste->id) // Lavages créés par lui-même
                  ->orWhereHas('receptionniste', function ($query) use ($structureId) {
                      $query->where('structure_id', $structureId); // Lavages d'autres réceptionnistes de sa structure
                  });
        })
        ->get();

    // ✅ Retourner les données avec Inertia
    return inertia('EtatLavage', [
        'lavages' => $lavages,
    ]);
}
public function index_etiquetage()
{
    $receptionniste = Auth::guard('web')->user(); 

    if (!$receptionniste || $receptionniste->role !== 'receptionniste') {
        return redirect('/')->withErrors('Aucun réceptionniste connecté.');
    }

    $structureId = $receptionniste->structure_id;

    // 🔥 Récupérer les lavages avec leurs vêtements en état "Etiquetage"
    $lavages = Lavage::with(['vetements' => function ($query) {
            $query->where('etat', 'etiquettage')->with('categorie', 'type');
        }])
        ->where(function ($query) use ($receptionniste, $structureId) {
            $query->where('receptionniste_id', $receptionniste->id)
                  ->orWhereHas('receptionniste', function ($query) use ($structureId) {
                      $query->where('structure_id', $structureId);
                  });
        })
        ->get();

    return inertia('Etiquetage', [
        'lavages' => $lavages,
    ]);
}



public function updateEmplacement(Request $request, $id)
{
    $request->validate([
        'emplacement_id' => 'required|exists:emplacements,id',
    ]);

    $lavage = Lavage::findOrFail($id);
    $lavage->emplacement_id = $request->emplacement_id;
    $lavage->save();

    return back()->with('success', 'Emplacement mis à jour.');
}
public function getLavagesTermines()
{  
    $acteur = Auth::guard('web')->user();
    if (!$acteur) {
        return redirect()->route('acteurs.login');
    }

    $structureId = $acteur->structure_id;

     // Récupérer les lavages dont tous les vêtements sont terminés
     $lavagesTermines = Lavage::whereDoesntHave('vetements', function ($query) {
        $query->where('etat', '!=', 'Terminé');
    }) // Vérifie que tous les vêtements sont terminés
    ->whereNull('emplacement_id') // Vérifie que l'emplacement_id est NULL
    ->whereHas('receptionniste', function ($subQuery) use ($structureId) {
        $subQuery->where('structure_id', $structureId);
    })
    ->get();
}


public function retirer(Lavage $lavage)
{
    $lavage->update(['etat' => 'Retiré']);
    $lavage->vetements()->update(['etat' => 'Retiré']);

    // $lavagesRetirer = Lavage::whereDoesntHave('vetements', function ($query) {
    //     $query->where('etat', '!=', 'Retiré');
    // });
    // Mail::to($lavagesRetirer->client->email)->send(new VetementsRetirerMail($lavagesRetirer));
    

    return back()->with('success', 'Lavage marqué comme retiré.');

   
}


public function details(Lavage $lavage)
{
    $lavage->load('client', 'vetements.categorie', 'vetements.type');
    return inertia('DetailsVetements', compact('lavage'));
}
public function dernierLavage()
{
    // Récupérer le dernier lavage enregistré avec ses vêtements
    $dernierLavage = Lavage::with('vetements')
        ->latest('created_at') // Trier par date de création
        ->first();

    if (!$dernierLavage) {
        return response()->json(['message' => 'Aucun lavage trouvé'], 404);
    }

    return response()->json(['lavage' => $dernierLavage]);
}

public function verifierCodeRetrait(Request $request)
{
    $validated = $request->validate([
        'lavage_id' => 'required|exists:lavages,id',
        'code_retrait' => 'required|string',
    ]);

    $lavage = Lavage::with(['client', 'emplacement'])->find($validated['lavage_id']);

    if (!$lavage) {
        return response()->json(['valid' => false, 'message' => "Lavage introuvable."], 404);
    }

    if (strtolower(trim($lavage->code_retrait)) === strtolower(trim($validated['code_retrait']))) {
        return response()->json([
            'valid' => true,
            'lavage' => [
                'id' => $lavage->id,
                'client' => [
                    'nom' => $lavage->client->nom ?? 'Inconnu',
                    'prenom' => $lavage->client->prenom ?? 'Inconnu'
                ],
                'emplacement' => ['nom' => $lavage->emplacement->nom ?? 'Non défini']
            ]
        ]);
    } else {
        return response()->json(['valid' => false, 'message' => "Code incorrect."], 200);
    }
}
public function edit($id)
{
    $lavage = Lavage::with(['client', 'vetements'])->findOrFail($id);
    return inertia('EditLavage', [
        'lavage' => $lavage,
        'clients' => Client::all(),
        'categories' => Categorie::all(),
        'types' => Type::all(),
        'consignes' => Consigne::all(),
    ]);
}

public function update(Request $request, $id)
{
    $lavage = Lavage::findOrFail($id);
    $lavage->update([
        'client_id' => $request->client_id,
        'consigne_id' => $request->consigne_id,
        'kilogrammes' => $request->kilogrammes,
        'status' => 'Non Payé',
    ]);

    foreach ($request->vetements as $vetementData) {
        // Vérifier et formater les dates avant mise à jour
        if (isset($vetementData['created_at'])) {
            $vetementData['created_at'] = Carbon::parse($vetementData['created_at'])->format('Y-m-d H:i:s');
        }
        if (isset($vetementData['updated_at'])) {
            $vetementData['updated_at'] = Carbon::parse($vetementData['updated_at'])->format('Y-m-d H:i:s');
        }

        Vetement::where('id', $vetementData['id'])->update($vetementData);
    }

    return redirect()->route('lavage.edit', $id)->with('success', 'Lavage mis à jour.');
}
public function toggleStatus($id)
{
    $lavage = Lavage::findOrFail($id);
    $lavage->status = $lavage->status === 'Payé' ? 'Non Payé' : 'Payé';
    $lavage->save();

    return back()->with('success', 'Statut mis à jour.');
}
public function destroy($id)
{
    $lavage = Lavage::findOrFail($id);
    $lavage->vetements()->delete(); // Supprime tous les vêtements liés
    $lavage->delete(); // Supprime le lavage

    return redirect('/receptionniste/nouveau-lavage')->with('success', 'Lavage supprimé.');
}

}