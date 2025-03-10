<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\ActeurController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\NouveauLavageController;

use App\Http\Controllers\LavageController;
use App\Http\Controllers\VetementController;
use App\Http\Controllers\FactureController;
use App\Http\Controllers\StructureController;

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TypeController;
use App\Http\Middleware\ProtectMiddleware;


Route::get('/login/structure', [AuthController::class, 'showStructureLogin'])->name('structure.login');
Route::get('/login/acteurs', [AuthController::class, 'showActeursLogin'])->name('acteurs.login');



Route::get('/', function () {
    return Inertia::render('Login');
});

Route::post('/', [AuthController::class, 'login']);




    
Route::get('/Laveur', function () {
    return Inertia::render('DashboardLaveur');
})->name('laveur');
Route::get('/Laveur/Taches', [VetementController::class,'indexLavage']);



Route::get('/Repasseur', function () {
    return Inertia::render('DashboardRepasseur');
})->name('repasseur');

Route::get('/repasseur/taches', [VetementController::class,'indexRepassage']);

Route::get('/Receptionniste', function () {
    return Inertia::render('DashboardReceptionniste');
})->name('Receptionniste');

Route::get('/Inscription', function () {
    return Inertia::render('Register');
});


Route::post('/Inscription', [ActeurController::class, 'store']);







Route::post('/Admin', [ActeurController::class, 'handleRequest']);


Route::get('/Admin/Emp/list', [ActeurController::class, 'index'])->name('admin.list');

// Route::get('/Admin/Emp/list', function () {
//     return Inertia::render('Admin');
// })-> name('AdminListEmp');

Route::delete('/Admin/Emp/list/{id}', [ActeurController::class, 'destroy']);



Route::middleware('auth')->group(function () {
    Route::get('/Admin/Emp/Ajout', function () {
    return Inertia::render('AjoutActeur');
})-> name('AdminEmp');
});


Route::get('/Admin/Emp', function () {
    return Inertia::render('Admin');
});

Route::get('/Admin/acceuil', function () {
    return Inertia::render('Admin'); });

Route::get('/Admin/fournisseur', function () {
    return Inertia::render('Admin'); });

Route::get('/AjoutClient', function () {
    return Inertia::render('AjoutClient');
});

// Route::get('/receptionniste/nouveau-lavage', function(){
//     return Inertia::render('NouveauLavage');
// });


// Route::middleware(['auth:web', ProtectMiddleware::class . ':receptionniste'])->group(function () {
Route::get('receptionniste/nouveau-lavage', [NouveauLavageController::class, 'nouveauLavage']); // Assure que seul un acteur connecté peut accéder à la page
Route::get('lavages/termines', [LavageController::class, 'getLavagesTermines']); // Assure que seul un acteur connecté peut accéder à la page
Route::post('/receptionniste/nouveau-lavage',[NouveauLavageController::class, 'store']);
Route::get('/receptionniste/acceuil', function(){
    return Inertia::render('DashboardReceptionniste');
});
// });



// Route::get('/receptionniste/etat-lavage', function(){
//     return Inertia::render('EtatLavage');
// });
// Route::get('/receptionniste/facture', function(){
//     return Inertia::render('Facture');
// });


Route::get('/unauthorized', function(){
    return Inertia::render('unauthorized');
});

Route::post('/clients', [ClientController::class, 'store']);

// Route::post('/lavages', [NouveauLavage::class, 'store']);

Route::get('/receptionniste/facture', [NouveauLavageController::class, 'showLastLavage'])->name('facture');
// Route::post('/receptionniste/factures', [FactureController::class, 'ImprimerFacture'])->name('factures');
Route::get('/receptionniste/factures/{id}', [FactureController::class, 'show'])->name('receptionniste.facture');

// Route::get('/receptionniste/factures', function(){
//     return Inertia::render('Factures');
// });


   
    
    Route::get('/receptionniste/etat-lavage', [LavageController::class, 'index']); // Liste des lavages
    Route::post('/lavages/{lavage}/retirer', [LavageController::class, 'retirer']); // Retirer un lavage
    Route::get('/lavages/{lavage}/details', [LavageController::class, 'details']); // Détails d'un lavage
    Route::post('/vetements/{vetement}/retirer', [VetementController::class, 'retirer']); // Retirer un vêtement
    
    Route::patch('/vetements/{id}/update-etat', [VetementController::class, 'updateEtat']);

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::get('/api/dernier-lavage', [LavageController::class, 'dernierLavage']);

    Route::get('/test-inertia', function () {
        dd(request()->header('X-Inertia'));
    });

    Route::post('receptionniste/verifier-retrait', [LavageController::class, 'verifierCodeRetrait']);

Route::get('/scan', function(){
    return Inertia::render('Scan');
});
Route::get('/bienvenue', function(){
    return Inertia::render('Bienvenue');
});
Route::get('/structures', function(){
    return Inertia::render('CreateStructure');
});

Route::post('/structures', [StructureController::class, 'store']);

Route::get('/structures/login', function(){
    return Inertia::render('LoginStructure');
})->name('login');



Route::post('/structures/login', [StructureController::class, 'login']);




Route::middleware(['auth:structure', ProtectMiddleware::class . ':structure'])->group(function () {
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
        Route::get('/Admin', function () {
    return Inertia::render('Admin');
})-> name('Admin');
});
Route::middleware(['auth:structure'])->group(function () {
    Route::get('/types', [TypeController::class, 'index']);
    Route::post('/types', [TypeController::class, 'store']);
    Route::put('/types/{id}', [TypeController::class, 'update']);
    Route::delete('/types/{id}', [TypeController::class, 'destroy']);
});

Route::middleware('auth:web')->group(function () {
    
});

Route::patch('/lavages/{id}/update-emplacement', [LavageController::class, 'updateEmplacement']);

// use App\Http\Controllers\RepassageController;

// Route::middleware(['auth:web'])->group(function () {
//     Route::get('/tache-repassage', [RepassageController::class, 'indexRepassage'])->name('tache.repassage');
//     Route::patch('/vetements/{vetement}/update-etat', [RepassageController::class, 'updateEtat']);
//     Route::patch('/lavages/{lavage}/update-emplacement', [RepassageController::class, 'updateEmplacement']);
// });



  
