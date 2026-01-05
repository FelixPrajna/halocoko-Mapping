<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OutletController;
use App\Http\Controllers\RoutingController;

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return view('welcome');
});

/*
|--------------------------------------------------------------------------
| AUTH
|--------------------------------------------------------------------------
*/
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| PROTECTED
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {

    // MAP
    Route::get('/map', function () {
        return view('homepage');
    })->name('map');

    // DASHBOARD
    Route::get('/create', function () {
        $outlets = \App\Models\Outlet::all();
        return view('dashboard', compact('outlets'));
    })->name('create');

    // UPLOAD OUTLET
    Route::post('/upload', [OutletController::class, 'upload'])
        ->name('outlet.upload');

    // API OUTLET (MAP)
    Route::get('/api/outlets', [OutletController::class, 'api'])
        ->name('api.outlets');

    // ROUTING GENERATE (INI PENTING)
    Route::post('/api/routing/generate', [RoutingController::class, 'generate'])
        ->name('routing.generate');

    // LOGOUT
    Route::post('/logout', [AuthController::class, 'logout']);
});
