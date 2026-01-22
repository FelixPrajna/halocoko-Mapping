<?php

namespace App\Http\Controllers;

use App\Models\Warehouse;
use Illuminate\Http\Request;

class WarehouseController extends Controller
{
    /**
     * Ambil gudang aktif (hanya 1)
     */
    public function index()
    {
        $warehouse = Warehouse::latest()->first();

        return response()->json($warehouse);
    }

    /**
     * Simpan gudang baru
     * Gudang lama akan diganti
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'latitude'  => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        // Pastikan hanya 1 gudang yang tersimpan
        Warehouse::truncate();

        $warehouse = Warehouse::create($validated);

        return response()->json([
            'status' => 'success',
            'data'   => $warehouse
        ]);
    }
}
