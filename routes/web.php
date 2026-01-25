<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OutletController;
use App\Http\Controllers\RoutingController;
use App\Http\Controllers\WarehouseController;

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return view('welcome');
})->name('welcome');

/*
|--------------------------------------------------------------------------
| AUTH
|--------------------------------------------------------------------------
*/
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.process');

/*
|--------------------------------------------------------------------------
| API (TANPA AUTH - DIPANGGIL JS)
|--------------------------------------------------------------------------
*/
Route::get('/api/warehouses', [WarehouseController::class, 'index']);
Route::post('/api/warehouses', [WarehouseController::class, 'store']);

Route::get('/api/outlets', [OutletController::class, 'api']);

/*
|--------------------------------------------------------------------------
| PROTECTED (WAJIB LOGIN)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {

    /*
    |================ MAP ====================
    */
    Route::get('/map', function () {
        return view('homepage');
    })->name('map');

    /*
    |================ ROUTE KIRIMAN ==========
    */
    Route::get('/kiriman', function () {
        return view('homepagekiriman');
    })->name('homepage.kiriman');

    /*
    |================ DASHBOARD ==============
    */
    Route::get('/create', function () {
        $outlets = \App\Models\Outlet::all();
        return view('dashboard', compact('outlets'));
    })->name('create');

    /*
    |================ OUTLET UPLOAD ==========
    */
    Route::post('/upload', [OutletController::class, 'upload'])
        ->name('outlet.upload');

    /*
    |================ ROUTING ================
    */
    Route::post('/api/routing/generate', [RoutingController::class, 'generate'])
        ->name('routing.generate');

    Route::post('/routing/save', [RoutingController::class, 'save'])
        ->name('routing.save');

    /*
    |================ LOGOUT =================
    */
    Route::post('/logout', [AuthController::class, 'logout'])
        ->name('logout');
});
