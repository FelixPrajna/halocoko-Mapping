<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Outlet;

class RoutingController extends Controller
{
    public function generate(Request $request)
    {
        $request->validate([
            'sales' => 'required|string',
            'day' => 'required|string',
            'maxOutlet' => 'required|integer|min:1'
        ]);

        // ===============================
        // TITIK GUDANG (NANTI BISA DINAMIS)
        // ===============================
        $warehouseLat = -6.2000;
        $warehouseLng = 106.8166;

        // ===============================
        // AMBIL DATA OUTLET DARI DATABASE
        // ===============================
        $outlets = Outlet::all();

        if ($outlets->isEmpty()) {
            return response()->json([
                'statistics' => [],
                'routes' => []
            ]);
        }

        // ===============================
        // HITUNG JARAK (HAVERSINE)
        // ===============================
        $calculated = $outlets->map(function ($o) use ($warehouseLat, $warehouseLng) {

            $distance = 6371 * acos(
                cos(deg2rad($warehouseLat)) *
                cos(deg2rad($o->latitude)) *
                cos(deg2rad($o->longitude) - deg2rad($warehouseLng)) +
                sin(deg2rad($warehouseLat)) *
                sin(deg2rad($o->latitude))
            );

            return [
                'id' => $o->id,
                'name' => $o->name,
                'latitude' => $o->latitude,
                'longitude' => $o->longitude,
                'distance' => round($distance, 2)
            ];
        });

        // ===============================
        // URUTKAN TERDEKAT
        // ===============================
        $sorted = $calculated->sortBy('distance')->values();

        // ===============================
        // BATASI MAX OUTLET
        // ===============================
        $selected = $sorted->take($request->maxOutlet);

        // ===============================
        // BENTUK 1 ROUTE (SIMPLE DULU)
        // ===============================
        $route = [
            'name' => 'Route 1',
            'sales' => $request->sales,
            'day' => $request->day,
            'outlets' => $selected,
            'distance' => $selected->sum('distance'),
            'est_time' => round($selected->sum('distance') / 40, 1) // estimasi 40km/jam
        ];

        // ===============================
        // STATISTIK
        // ===============================
        $statistics = [
            'total_routes' => 1,
            'total_outlets' => $selected->count(),
            'avg_outlets' => $selected->count(),
            'total_distance' => round($route['distance'], 1),
            'avg_distance' => round($route['distance'], 1)
        ];

        return response()->json([
            'statistics' => $statistics,
            'routes' => [$route]
        ]);
    }
}
