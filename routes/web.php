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

Route::get('/', function () {
    return Inertia::render('Login');
});

Route::post('/', [AuthController::class, 'login']);


Route::get('/Repasseur', function () {
    return Inertia::render('Repasseur');
});

Route::middleware(['Checkrole'])->group(function (){

});
    
Route::get('/Laveur', function () {
    return Inertia::render('Laveur');
});
Route::get('/Laveur/Taches', [VetementController::class,'index']);

Route::get('/laveur/acceuil', function () {
    return Inertia::render('DashboardLaveur');
});

Route::get('/Receptionniste', function () {
    return Inertia::render('DashboardReceptionniste');
})->name('Receptionniste')->middleware('role:receptionniste');

Route::get('/Inscription', function () {
    return Inertia::render('Register');
});


Route::post('/Inscription', [ActeurController::class, 'store']);



Route::get('/Admin', function () {
    return Inertia::render('Admin');
})-> name('Admin')->middleware('role:admin');

Route::post('/Admin', [ActeurController::class, 'handleRequest']);


Route::get('/Admin/Emp/list', [ActeurController::class, 'index', 'indexx'])->name('admin.list');

// Route::get('/Admin/Emp/list', function () {
//     return Inertia::render('Admin');
// })-> name('AdminListEmp');

Route::delete('/Admin/Emp/list/{id}', [ActeurController::class, 'destroy']);

Route::get('/Admin/Emp/Ajout', function () {
    return Inertia::render('Admin');
})-> name('AdminEmp');

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



Route::get('receptionniste/nouveau-lavage', function () {
    return Inertia::render('NouveauLavage', [
        'clients' => \App\Models\Client::all(),
        'categories' => \App\Models\Categorie::all(),
        'types' => \App\Models\Type::all(),
    ]);
});

Route::post('/receptionniste/nouveau-lavage',[NouveauLavageController::class, 'store']);

Route::get('/receptionniste/etat-lavage', function(){
    return Inertia::render('EtatLavage');
});
Route::get('/receptionniste/facture', function(){
    return Inertia::render('Facture');
});

Route::get('/receptionniste/acceuil', function(){
    return Inertia::render('DashboardReceptionniste');
});
Route::get('/unauthorized', function(){
    return Inertia::render('unauthorized');
});

Route::post('/clients', [ClientController::class, 'store']);

// Route::post('/lavages', [NouveauLavage::class, 'store']);

Route::get('/receptionniste/facture', [NouveauLavageController::class, 'showLastLavage'])
    ->name('receptionniste.facture');



   
    
    Route::get('/receptionniste/etat-lavage', [LavageController::class, 'index']); // Liste des lavages
    Route::post('/lavages/{lavage}/retirer', [LavageController::class, 'retirer']); // Retirer un lavage
    Route::get('/lavages/{lavage}/details', [LavageController::class, 'details']); // Détails d'un lavage
    Route::post('/vetements/{vetement}/retirer', [VetementController::class, 'retirer']); // Retirer un vêtement
    
    Route::post('/vetements/{id}/update-etat', [VetementController::class, 'updateEtat']);

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');