<?php
namespace App\Http\Controllers;

use App\Models\Acteur;
use GuzzleHttp\Psr7\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

class ActeurController extends Controller

{
    public function store(Request $request)
    {
        // Valider les données
        $validatedData = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'telephone' => 'nullable|string|max:20',
            'password' => 'required|string|min:8',
        ]);

        Log::info('Données validées : ', $validatedData);
        // dd($request->all());

        // Vérifier si un admin existe déjà
    $adminExists = Acteur::where('role', 'admin')->exists();
    $acteur = Acteur::where('email', $request->email)->first();

    if ($acteur && $adminExists) {
    $acteur->update([
            'nom' => $validatedData['nom'],
            'prenom' => $validatedData['prenom'],
            'email' => $validatedData['email'],
            'telephone' => $validatedData['telephone'],
            'password' => Hash::make($validatedData['password']),
    ]);
}


    if ($adminExists && !$acteur) {
        return response()->json(['message' => 'Inscription non autorisée. Contactez l\'admin.'], 403);
    }

    if (!$adminExists){

        // Créer un nouvel acteur 
        Acteur::create([
            'nom' => $validatedData['nom'],
            'prenom' => $validatedData['prenom'],
            'email' => $validatedData['email'],
            'telephone' => $validatedData['telephone'],
            'password' => Hash::make($validatedData['password']),
            'role' => Acteur::count() === 0 ? 'admin' : 'admin', // Premier utilisateur = admin
        ]);
    }

       

    

        // Log::info('Acteur créé : ', $acteur->toArray());

        return redirect('/'); 

        
    
}

    public function handleRequest(Request $request)
{
    $action = $request->input('action');

    switch ($request->action) {
        case 'addActor':
            return $this->addActor($request);
        case 'completeRegistration':
            return $this->completeRegistration($request);
        // default:
        // return Inertia::render('ErrorPage', [
        //     'message' => 'Action inconnue',
        // ]);
    }
}


public function addActor(Request $request)
{
    // Vérifier si une structure est bien connectée
    if (!Auth::guard('structure')->check()) {
        return Inertia::render('AjoutActeur', ['error' => 'Aucune structure connectée.']);
    }

    // Récupérer l'ID de la structure connectée
    $structureId = Auth::guard('structure')->id();

    // Validation des données
    $request->validate([
        'nom' => 'nullable|string|max:255',
        'prenom' => 'nullable|string|max:255',
        'email' => 'required|email',
        'password' => 'nullable|string|min:8',
        'role' => 'required|in:receptionniste,repasseur,laveur',
    ]);

    $acteur = Acteur::where('email', $request->email)->first();

    if (!$acteur) {
        // Création d'un nouvel acteur
        Acteur::create([
            'email' => $request->email,
            'role' => $request->role,
            'password' => bcrypt('default_password'), // Peut être une valeur par défaut
            'nom' => $request->nom, // ?? 'Nom par défaut',
            'prenom' => $request->prenom, // ?? 'Prénom par défaut',
            'structure_id' => $structureId,
        ]);

        return Inertia::render('AjoutActeur', ['success' => 'Acteur ajouté avec succès.']);
    }

    return Inertia::render('AjoutActeur', ['error' => 'Cet email existe déjà.']);
}



public function completeRegistration(Request $request)
{
    $request->validate([
        'email' => 'required|email|exists:acteurs,email',
        'nom' => 'required|string',
        'prenom' => 'required|string',
        'telephone' => 'required|string',
        'password' => 'required|string|min:8',
    ]);

    $acteur = Acteur::where('email', $request->email)->first();

    if (!$acteur) {
        return response()->json(['message' => 'Aucun acteur trouvé avec cet email.'], 404);
    }

    $acteur->update([
        'nom' => $request->nom,
        'prenom' => $request->prenom,
        'telephone' => $request->telephone,
        'password' => bcrypt($request->password),
    ]);

    return response()->json(['message' => 'Inscription complétée avec succès.', 'acteur' => $acteur], 200);
}

public function index()
{
    // ✅ Vérifier si une structure est connectée
    $structure = Auth::guard('structure')->user();

    if (!$structure) {
        return redirect()->route('login')->withErrors('Aucune structure connectée.');
    }

    // ✅ Récupérer tous les acteurs appartenant à cette structure
    $acteurs = Acteur::where('structure_id', $structure->id)->where('actif', 'O')->get();

    // ✅ Retourner les données au frontend via Inertia
    return Inertia::render('ListActeur', [
        'acteurs' => $acteurs,
    ]);
}


public function destroy($id)
{
    $acteur = Acteur::findOrFail($id);
    $acteur->update(['actif' => 'N']); // ⚠️ Met à jour au lieu de supprimer

    // return redirect()->back()->with('success', 'Acteur supprimé avec succès.');
}

public function update(Request $request)
{
    Log::info('Données reçues pour mise à jour :', $request->all());

    // Récupérer l'utilisateur connecté
    $acteur = Auth::guard('web')->user();

    if (!$acteur) {
        Log::error("Aucun acteur trouvé !");
        return redirect()->route('acteurs.login')->with('error', "Vous devez être connecté.");
    }

    // Règles de validation de base
    $validationRules = [
        'nom' => 'nullable|string|max:255',
        'prenom' => 'nullable|string|max:255',
        'telephone' => 'nullable|string|max:20',
        'email' => 'nullable|email|unique:acteurs,email,'.$acteur->id,
    ];

    // Ajout des règles pour le changement de mot de passe si nécessaire
    if ($request->filled('current_password') || $request->filled('new_password')) {
        $validationRules = array_merge($validationRules, [
            'current_password' => [
                'required',
                'string',
                'min:8',
                function ($attribute, $value, $fail) use ($acteur) {
                    if (!Hash::check($value, $acteur->password)) {
                        $fail('Le mot de passe actuel est incorrect.');
                    }
                }
            ],
            'new_password' => 'required|string|min:8|different:current_password',
        ]);
    }

    // Validation des données
    $validated = $request->validate($validationRules);

    // Mise à jour des champs de base
    $acteur->nom = $validated['nom'] ?? $acteur->nom;
    $acteur->prenom = $validated['prenom'] ?? $acteur->prenom;
    $acteur->telephone = $validated['telephone'] ?? $acteur->telephone;
    $acteur->email = $validated['email'] ?? $acteur->email;

    // Mise à jour du mot de passe si fourni
    if (!empty($validated['new_password'])) {
        $acteur->password = Hash::make($validated['new_password']);
    }

    /** @var \App\Models\Acteur $acteur */
    $acteur->save();

    Log::info('Données mises à jour avec succès !', ['acteur' => $acteur]);

    switch ($acteur->role) {
        case 'super_admin':
            return Inertia::render('DashboardSuper', [
                'acteur' => $acteur,
                'success' => "Profil mis à jour avec succès !",
            ]);
        case 'repasseur':
            return Inertia::render('DashboardRepasseur', [
                'acteur' => $acteur,
                'success' => "Profil mis à jour avec succès !",
            ]);
        case 'receptionniste':
            return Inertia::render('DashboardReceptionniste', [
                'acteur' => $acteur,
                'success' => "Profil mis à jour avec succès !",
            ]);
        case 'laveur':
            return Inertia::render('DashboardLaveur', [
                'acteur' => $acteur,
                'success' => "Profil mis à jour avec succès !",
            ]);
    }

   
}
public function edit()
{
    $acteur = Auth::guard('web')->user(); // ✅ Récupérer l'acteur connecté

    return Inertia::render('ProfilActeur', [
        'acteur' => $acteur,
    ]);
}
}

