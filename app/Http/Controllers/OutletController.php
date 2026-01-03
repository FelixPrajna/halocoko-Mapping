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

        // hapus data lama (biar selalu pakai file terbaru)
        DB::table('outlets')->truncate();

        $file = $request->file('file');
        $sheets = Excel::toArray([], $file);
        $rows = $sheets[0];

        foreach ($rows as $i => $row) {
            if ($i === 0) continue; // skip header

            if (!isset($row[0], $row[1], $row[2])) continue;

            $lat = (float) str_replace(',', '.', $row[1]);
            $lng = (float) str_replace(',', '.', $row[2]);

            // validasi range koordinat
            if ($lat < -90 || $lat > 90) continue;
            if ($lng < -180 || $lng > 180) continue;

            Outlet::create([
                'name'      => trim($row[0]),
                'latitude'  => $lat,
                'longitude' => $lng,
            ]);
        }

        return back()->with('success', 'Data outlet berhasil diupload');
    }

    // API UNTUK MAP
    public function apiOutlets()
    {
        return response()->json(
            Outlet::select('id', 'name', 'latitude', 'longitude')->get()
        );
    }
}
