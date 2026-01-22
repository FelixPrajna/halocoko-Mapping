<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Halocoko | Rute Kiriman</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">


    <!-- Leaflet -->
    <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    />

    <!-- CSS KHUSUS KIRIMAN -->
    <link rel="stylesheet" href="{{ asset('css/homepagekiriman.css') }}">
</head>
<body>

<!-- ================= NAVBAR ================= -->
<nav class="navbar">
    <div class="navbar-left">
        🚚 <strong>Halocoko Rute Kiriman</strong>
    </div>

    <div class="navbar-right">
        <div class="user-info">
            <div class="user-name">{{ auth()->user()->name }}</div>
            <div class="user-email">{{ auth()->user()->email }}</div>
        </div>

        <form action="{{ route('logout') }}" method="POST">
            @csrf
            <button type="submit" class="btn-logout">Logout</button>
        </form>
    </div>
</nav>

<!-- ================= MAP ================= -->
<div id="map"></div>

<!-- ================= FORM GUDANG ================= -->
<section class="warehouse-section">
    <div class="warehouse-card">
        <h3>📦 Tambah Titik Gudang</h3>

        <div class="warehouse-form">

            <div class="form-group">
                <label>Nama Gudang / Toko</label>
                <input
                    type="text"
                    id="warehouseName"
                    placeholder="Contoh: Gudang Jakarta"
                >
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Latitude</label>
                    <input
                        type="number"
                        step="any"
                        id="warehouseLat"
                        placeholder="-6.200000"
                    >
                </div>

                <div class="form-group">
                    <label>Longitude</label>
                    <input
                        type="number"
                        step="any"
                        id="warehouseLng"
                        placeholder="106.816666"
                    >
                </div>
            </div>

            <button type="button" id="btnAddWarehouse" class="btn-add">
                ➕ Tambah Gudang
            </button>

        </div>
    </div>
</section>

<!-- ================= UPLOAD CSV ================= -->
<section class="upload-section">
    <div class="upload-card">
        <h3>📄 Upload Data Lokasi (CSV)</h3>

        <form
            action="#"
            method="POST"
            enctype="multipart/form-data"
            class="upload-form"
        >
            @csrf

            <div class="upload-box">
                <input
                    type="file"
                    name="csv_file"
                    id="csvFile"
                    accept=".csv"
                    required
                >
                <label for="csvFile">
                    <strong>Klik untuk upload</strong> atau drag file CSV ke sini
                </label>
                <span class="file-hint">
                    Format: nama_toko, latitude, longitude
                </span>
            </div>

            <button type="submit" class="btn-upload">
                ⬆️ Upload CSV
            </button>
        </form>
    </div>
</section>


<!-- ================= FOOTER ================= -->
<footer class="footer">
    © {{ date('Y') }} <strong>Halocoko</strong> — Distribution Route System
</footer>

<!-- ================= SCRIPT ================= -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="{{ asset('js/homepagekiriman.js') }}"></script>


</body>
</html>
