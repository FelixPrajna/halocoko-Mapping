<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Tampilkan halaman login
     */
public function showLogin(Request $request)
{
    return view('login', [
        'redirect' => $request->redirect
    ]);
}


    /**
     * Proses login
     */
    public function login(Request $request)
{
    $credentials = $request->validate([
        'email'    => 'required|email',
        'password' => 'required',
    ]);

    if (Auth::attempt($credentials)) {
        $request->session()->regenerate();

        if ($request->redirect === 'kiriman') {
            return redirect()->route('homepage.kiriman');
        }

        if ($request->redirect === 'map') {
            return redirect()->route('map');
        }

        // fallback
        return redirect()->route('map');
    }

    return back()->withErrors([
        'login' => 'Email atau password salah',
    ]);
}


    /**
     * Logout
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
