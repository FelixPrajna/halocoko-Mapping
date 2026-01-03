<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Outlet;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\DB;

class OutletController extends Controller
{
    // UPLOAD EXCEL
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv'
        ]);

        DB::table('outlets')->truncate();

        $rows = Excel::toArray([], $request->file('file'))[0];

        foreach ($rows as $i => $row) {
            if ($i === 0) continue;
            if (!isset($row[0], $row[1], $row[2])) continue;

            Outlet::create([
                'name' => trim($row[0]),
                'latitude' => (float) str_replace(',', '.', $row[1]),
                'longitude' => (float) str_replace(',', '.', $row[2]),
            ]);
        }

        return redirect()->route('create')
            ->with('success', 'Upload berhasil');
    }

    // API MAP
    public function api()
    {
        return response()->json(
            Outlet::whereNotNull('latitude')
                ->whereNotNull('longitude')
                ->get()
        );
    }
}
