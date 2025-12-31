<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PageController extends Controller
{
    /**
     * Menampilkan halaman dashboard
     */
    public function dashboard()
    {
        return view('dashboard');
    }
}
