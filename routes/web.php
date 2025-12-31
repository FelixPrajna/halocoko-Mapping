<?php
use App\Http\Controllers\PageController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

/* Welcome */
Route::get('/', function () {
    return view('welcome');
});

/* Login */
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);

/* Protected */
Route::middleware('auth')->group(function () {

    Route::get('/map', function () {
        return view('homepage');
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    // Route Create → Dashboard
    Route::post('/create', [PageController::class, 'dashboard'])->name('create.dashboard');
});
