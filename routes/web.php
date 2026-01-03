<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OutletController;

Route::get('/', function () {
    return view('welcome');
});

/* LOGIN */
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);

/* PROTECTED */
Route::middleware('auth')->group(function () {

    // MAP
    Route::get('/map', function () {
        return view('homepage');
    })->name('map');

    // CREATE
    Route::get('/create', function () {
        $outlets = \App\Models\Outlet::all();
        return view('dashboard', compact('outlets'));
    })->name('create');

    // UPLOAD
    Route::post('/upload', [OutletController::class, 'upload'])
        ->name('outlet.upload');

    // API DATA MAP
    Route::get('/api/outlets', [OutletController::class, 'api'])
        ->name('api.outlets');

    // LOGOUT
    Route::post('/logout', [AuthController::class, 'logout']);
});
