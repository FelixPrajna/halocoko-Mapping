<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Outlet;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Validator;

class OutletController extends Controller
{
    public function index() {
        return view('dashboard');
    }

    public function upload(Request $request) {
        $request->validate([
            'file' => 'required|mimes:csv,xlsx,xls'
        ]);

        $file = $request->file('file');

        // baca Excel/CSV
        $data = Excel::toArray([], $file); // return array semua sheet
        $rows = $data[0]; // pakai sheet pertama

        foreach($rows as $index => $row) {
            // skip header
            if($index == 0) continue;

            Outlet::create([
                'name' => $row[0] ?? 'Unknown',
                'latitude' => $row[1] ?? 0,
                'longitude' => $row[2] ?? 0
            ]);
        }

        return back()->with('success', 'File berhasil diupload dan data tersimpan!');
    }
}
