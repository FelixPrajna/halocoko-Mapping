<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OutletController;

Route::get('/', function () {
    return view('welcome');
});

/* Login */
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);

/* Protected */
Route::middleware('auth')->group(function () {

    // MAP HOMEPAGE
    Route::get('/map', function () {
        return view('homepage');
    })->name('map');

    // CREATE / DASHBOARD
    Route::get('/create', function () {
        return view('dashboard');
    })->name('create');

    // UPLOAD EXCEL
    Route::post('/upload', [OutletController::class, 'upload'])
        ->name('outlet.upload');

    // 🔥 API DATA OUTLET (INI YANG KURANG)
    Route::get('/api/outlets', [OutletController::class, 'api'])
        ->name('api.outlets');

    // LOGOUT
    Route::post('/logout', [AuthController::class, 'logout']);
});
