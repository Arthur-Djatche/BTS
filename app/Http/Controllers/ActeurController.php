<?php
namespace App\Http\Controllers;

use App\Models\Acteur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
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
    $request->validate([
        'nom' => 'nullable|string|max:255',
        'prenom' => 'nullable|string|max:255',
        'email' => 'required|email',
        'password' => 'nullable|string|min:8',
        'role' => 'required|in:receptionniste,repasseur,laveur',
        
    ]);

    $acteur = Acteur::where('email', $request->email)->first();

    if(!$acteur){

    $acteur = Acteur::create([
        'email' => $request->email,
        'role' => $request->role,
        'password' => bcrypt('default_password'), // Peut être une valeur par défaut
        'nom' => $request->nom, // ?? 'Nom par défaut',
        'prenom' => $request->prenom,  //?? 'Prenom par défaut',
    ]);

    return response()->json(['message' => 'Acteur ajouté avec succès.', 'acteur' => $acteur], 201);
}
    return response()->json(['message' => 'email existant', 'acteur' => $acteur], 201);
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
    

}

