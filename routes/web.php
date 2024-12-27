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
    return Inertia::render('Receptionniste');
});

Route::get('/Inscription', function () {
    return Inertia::render('Register');
});


Route::post('/Inscription', [ActeurController::class, 'store']);



Route::get('/Admin', function () {
    return Inertia::render('Admin');
})-> name('Admin');

Route::get('/AjoutClient', function () {
    return Inertia::render('AjoutClient');
});