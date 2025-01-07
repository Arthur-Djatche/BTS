<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\ActeurController;
use App\Http\Controllers\AuthController;


Route::get('/', function () {
    return Inertia::render('Login');
});

Route::post('/', [AuthController::class, 'login']);


Route::get('/Repasseur', function () {
    return Inertia::render('Repasseur');
});
    
Route::get('/Laveur', function () {
    return Inertia::render('Laveur');
});

Route::get('/Receptionniste', function () {
    return Inertia::render('NouveauLavage');
})->name('Receptionniste');

Route::get('/Inscription', function () {
    return Inertia::render('Register');
});


Route::post('/Inscription', [ActeurController::class, 'store']);



Route::get('/Admin', function () {
    return Inertia::render('Admin');
})-> name('Admin');

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

Route::get('/receptionniste/nouveau-lavage', function(){
    return Inertia::render('NouveauLavage');
});

Route::post('/receptionniste/nouveau-lavage', function(){
    return Inertia::render('NouveauLavage');
});

Route::get('/receptionniste/etat-lavage', function(){
    return Inertia::render('EtatLavage');
});

Route::get('/receptionniste/acceuil', function(){
    return Inertia::render('DashboardReceptionniste');
});