<?php

namespace App\Http\Controllers;
use App\Mail\VetementsRetirerMail;
use App\Models\Vetement;
use App\Models\Lavage;
use App\Models\Emplacement;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Mail\VetementsPretsMail;
use App\Mail\VetementsEnLavageMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Services\OrangeSmsService;


class VetementController extends Controller
{
    
    public function retirer(Vetement $vetement)
{
    $vetement->update(['etat' => 'Retiré']);
    return back()->with('success', 'Vêtement marqué comme retiré.');
}
 
public function updateEtat(Request $request, $id, OrangeSmsService $smsService)
{
    // ✅ Validation des données envoyées
    $validated = $request->validate([
        'etat' => 'required|in:En lavage,En repassage,Terminé,Retiré',
        'type_consigne' => 'nullable|string'
    ]);

    // ✅ Récupérer le vêtement avec ses relations
    $vetement = Vetement::with('lavage.consigne', 'lavage.client')->findOrFail($id);
    $lavage = $vetement->lavage;
    $consigne = $lavage->consigne; // ✅ On suppose que consigne existe toujours
    $client = $lavage->client;

    Log::info("💾 Vetement trouvé :", ['id' => $vetement->id, 'etat_actuel' => $vetement->etat]);

    // ✅ Déterminer le type de consigne
    if ($validated['etat'] === 'En repassage' && $consigne->type_consigne === 'Repassage_Simple') {
        Log::info("🛠 Repassage simple détecté, laveur_id reste NULL");
        $vetement->laveur_id = null;
    } elseif ($validated['etat'] === 'En repassage') {
        $vetement->laveur_id = Auth::guard('web')->id();
    } elseif ($validated['etat'] === 'Terminé' && $consigne->type_consigne === 'Lavage_Simple') {
        $vetement->laveur_id = Auth::guard('web')->id();
        $vetement->repasseur_id = null;
    } elseif ($validated['etat'] === 'Terminé') {
        $vetement->repasseur_id = Auth::guard('web')->id();
    }

    // ✅ Mise à jour de l'état
    $vetement->etat = $validated['etat'];
    $vetement->save();

    // ✅ Vérifier si tous les vêtements du lavage sont "Terminé"
    $tousPrets = $lavage->vetements->every(fn($v) => $v->etat === 'Terminé');
    if ($tousPrets) {
        Log::info("✅ Tous les vêtements sont TERMINÉS pour le lavage N° {$lavage->id}");

        // ✅ Envoi du mail
        Mail::to($client->email)->send(new VetementsPretsMail($lavage));

        // ✅ Envoi du SMS
        // $message = "Cher(e) {$client->nom} {$client->prenom}, vos vêtements du lavage N° " . 
        //     str_pad($lavage->id, 4, '0', STR_PAD_LEFT) . 
        //     " sont prêts. Vous pouvez venir les récupérer.";

        // $this->sendSmsSafe($smsService, $client->telephone, $message);
    }

    // ✅ Vérifier si tous les vêtements sont "En lavage"
    $tousEnLavage = $lavage->vetements->every(fn($v) => $v->etat === 'En lavage');
    if ($tousEnLavage) {
        Log::info("✅ Tous les vêtements sont EN LAVAGE pour le lavage N° {$lavage->id}");

        // ✅ Envoi du mail
        Mail::to($client->email)->send(new VetementsEnLavageMail($lavage));

        // ✅ Envoi du SMS
        // $message = "Cher(e) {$client->nom} {$client->prenom}, votre lavage N° " . 
        //     str_pad($lavage->id, 4, '0', STR_PAD_LEFT) . 
        //     " a été reçu avec succès. {$consigne->type_consigne} - {$consigne->priorite_consigne}. " .
        //     "Code retrait : {$lavage->code_retrait}. Nous vous informerons lorsqu'ils seront prêts.";

        // $this->sendSmsSafe($smsService, $client->telephone, $message);
    }

    // ✅ Vérifier si tous les vêtements sont "Retirés"
    $lavagesRetirer = $lavage->vetements->every(fn($v) => $v->etat === 'Retiré');
    if ($lavagesRetirer) {
        Log::info("✅ Tous les vêtements sont RETIRÉS pour le lavage N° {$lavage->id}");

        // ✅ Envoi du mail
        Mail::to($client->email)->send(new VetementsRetirerMail($lavage));

        // // ✅ Envoi du SMS
        // $message = "Cher(e) {$client->nom} {$client->prenom}, vos vêtements du lavage N° " . 
        //     str_pad($lavage->id, 4, '0', STR_PAD_LEFT) . 
        //     " ont été retirés avec succès. Merci de votre confiance !";

        // $this->sendSmsSafe($smsService, $client->telephone, $message);
    }

    return redirect()->back()->with('success', 'État du vêtement mis à jour avec succès.');
}

/**
 * ✅ Fonction pour envoyer un SMS en toute sécurité avec logs
 */
private function sendSmsSafe($smsService, $telephone, $message)
{
    if (empty($telephone)) {
        Log::warning("❌ Numéro de téléphone vide, SMS non envoyé.");
        return;
    }

    try {
        $response = $smsService->sendSms($telephone, $message);
        Log::info("📤 SMS envoyé à {$telephone} : {$message}", ['response' => $response]);
    } catch (\Exception $e) {
        Log::error("❌ Erreur lors de l'envoi du SMS à {$telephone} : " . $e->getMessage());
    }
}




public function indexLavage()
{
    // Récupérer l'utilisateur connecté (acteur)
    $acteur = Auth::guard('web')->user();

    // Vérifier qu'un acteur est bien connecté
    if (!$acteur) {
        return redirect()->route('acteurs.login'); // Redirection si non connecté
    }

    // Récupérer la structure associée à l'acteur connecté
    $structureId = $acteur->structure_id;

    // Vérifier s'il y a des vêtements "Express"
    $vetementsExpress = Vetement::whereHas('lavage', function ($query) use ($structureId) {
            $query->whereHas('receptionniste', function ($subQuery) use ($structureId) {
                $subQuery->where('structure_id', $structureId);
            });
        })
        ->where('etat', 'En lavage')
        ->whereHas('lavage.consigne', function ($query) {
            $query->where('priorite_consigne', 'Express');
        })
        ->with(['categorie', 'type', 'lavage.consigne'])
        ->get();

    // Si on a des vêtements "Express", on les retourne uniquement
    if ($vetementsExpress->isNotEmpty()) {
        return inertia('TacheLavages', [
            'vetements' => $vetementsExpress,
            'emplacements' => Emplacement::where('structure_id', $structureId)->get(),
            'lavagesTermines' => Lavage::whereDoesntHave('vetements', function ($query) {
                    $query->where('etat', '!=', 'Terminé');
                })
                ->whereNull('emplacement_id') // Vérifie que l'emplacement est NULL
                ->whereHas('receptionniste', function ($subQuery) use ($structureId) {
                    $subQuery->where('structure_id', $structureId);
                })
                ->whereHas('consigne', function ($query) { 
                    $query->whereIn('type_consigne', ['Lavage_Simple']);
                }) // Ajoute la condition sur type_consigne
                ->get(),
        ]);
    }

    // Sinon, récupérer tous les autres vêtements en lavage
    $vetementsNormaux = Vetement::whereHas('lavage', function ($query) use ($structureId) {
            $query->whereHas('receptionniste', function ($subQuery) use ($structureId) {
                $subQuery->where('structure_id', $structureId);
            });
        })
        ->where('etat', 'En lavage')
        ->with(['categorie', 'type', 'lavage.consigne'])
        ->get();

        return inertia('TacheLavages', [
            'vetements' => $vetementsNormaux,
            'emplacements' => Emplacement::where('structure_id', $structureId)->get(),
            'lavagesTermines' => Lavage::whereDoesntHave('vetements', function ($query) {
                    $query->where('etat', '!=', 'Terminé');
                })
                ->whereNull('emplacement_id') // Vérifie que l'emplacement est NULL
                ->whereHas('receptionniste', function ($subQuery) use ($structureId) {
                    $subQuery->where('structure_id', $structureId);
                })
                ->whereHas('consigne', function ($query) { 
                    $query->whereIn('type_consigne', ['Lavage_Simple',]);
                }) // Ajoute la condition sur type_consigne
                ->get(),
        ]);
    }




public function indexRepassage()
{
    // Récupérer l'utilisateur connecté (acteur)
    $acteur = Auth::guard('web')->user();

    // Vérifier qu'un acteur est bien connecté
    if (!$acteur) {
        return redirect()->route('acteurs.login'); // Redirection si non connecté
    }

    // Récupérer la structure associée à l'acteur connecté
    $structureId = $acteur->structure_id;

    // ✅ Vérifier s'il y a des vêtements "Express" en repassage
    $vetementsExpress = Vetement::whereHas('lavage', function ($query) use ($structureId) {
            $query->whereHas('receptionniste', function ($subQuery) use ($structureId) {
                $subQuery->where('structure_id', $structureId);
            });
        })
        ->where('etat', 'En repassage')
        ->whereHas('lavage.consigne', function ($query) {
            $query->where('priorite_consigne', 'Express');
            $query->where('type_consigne', 'Repassage_Simple, Lavage_Repassage');
        })
        ->with(['categorie', 'type', 'lavage.consigne'])
        ->get();

    // ✅ Si des vêtements Express existent, on les retourne en priorité
    if ($vetementsExpress->isNotEmpty()) {
        return inertia('TacheRepassage', [
            'vetements' => $vetementsExpress,
            'emplacements' => Emplacement::where('structure_id', $structureId)->get(),
            'lavagesTermines' => Lavage::whereDoesntHave('vetements', function ($query) {
                    $query->where('etat', '!=', 'Terminé');
                })
                ->whereNull('emplacement_id') // Vérifie que l'emplacement est NULL
                ->whereHas('receptionniste', function ($subQuery) use ($structureId) {
                    $subQuery->where('structure_id', $structureId);
                })
                ->whereHas('consigne', function ($query) { 
                    $query->whereIn('type_consigne', ['Repassage_Simple', 'Lavage_Repassage']);
                }) // Ajoute la condition sur type_consigne
                ->get(),
        ]);
    }

    // ✅ Sinon, récupérer tous les autres vêtements en repassage
    $vetementsNormaux = Vetement::whereHas('lavage', function ($query) use ($structureId) {
            $query->whereHas('receptionniste', function ($subQuery) use ($structureId) {
                $subQuery->where('structure_id', $structureId);
            });
        })
        ->where('etat', 'En repassage')
        ->with(['categorie', 'type', 'lavage.consigne'])
        ->get();

    return inertia('TacheRepassage', [
        'vetements' => $vetementsNormaux,
        'emplacements' => Emplacement::where('structure_id', $structureId)->get(),
        'lavagesTermines' => Lavage::whereDoesntHave('vetements', function ($query) {
                $query->where('etat', '!=', 'Terminé');
            })
            ->whereNull('emplacement_id')
            ->whereHas('receptionniste', function ($subQuery) use ($structureId) {
                $subQuery->where('structure_id', $structureId);
            })
            ->whereHas('consigne', function ($query) { 
                $query->whereIn('type_consigne', ['Repassage_Simple', 'Lavage_Repassage']);
            })
            ->get(),
    ]);
}

public function renvoyer(Request $request)
{
    $request->validate([
        'lavage_id' => 'required|exists:lavages,id',
        'etat' => 'required|string'
    ]);

    // Mettre à jour tous les vêtements ayant le même lavage_id et le même état
    Vetement::where('lavage_id', $request->lavage_id)
        ->where('etat', $request->etat)
        ->update(['etat' => 'etiquettage']);

    return back()->with('success', 'Vêtements renvoyés en étiquetage.');
}
public function updateEtiquete(Request $request)
{
    $lavages = $request->lavages;

    foreach ($lavages as $lavage) {
        foreach ($lavage['vetements'] as $vetement) {
            $nouvelEtat = 'En lavage'; // Par défaut

            // ✅ Vérifier le type de consigne pour déterminer le nouvel état
            if (!empty($lavage['consigne']) && in_array($lavage['consigne']['nom'], ['Lavage_Simple', 'Lavage_Repassage'])) {
                $nouvelEtat = 'En repassage';
            }

            Vetement::where('id', $vetement['id'])->update(['etat' => $nouvelEtat]);
        }
    }
 // ✅ Redirection vers la page actuelle avec un message de succès
 return redirect('/receptionniste/acceuil')->with('success', 'Les étiquettes ont été imprimées et les états mis à jour.');
}

}
