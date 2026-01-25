<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Halocoko | Rute Kiriman</title>
    <meta name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- Leaflet -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>

    <!-- CSS -->
    <link rel="stylesheet" href="{{ asset('css/homepagekiriman.css') }}">
</head>
<body>

<!-- ================= NAVBAR ================= -->
<nav class="navbar-wrapper">
    <div class="navbar">
        <div class="nav-left">
            🚚 <strong>halocoko | Rute Kiriman</strong>
        </div>

        <div class="nav-right">
            <div class="user">
                <div class="name">{{ auth()->user()->name }}</div>
                <div class="email">{{ auth()->user()->email }}</div>
            </div>

            <form action="{{ route('logout') }}" method="POST">
                @csrf
                <button class="btn-logout">Logout</button>
            </form>
        </div>
    </div>
</nav>

<!-- ================= HERO ================= -->
<section class="hero">
    <h1>Dashboard Gudang</h1>
    <p>Masukkan lokasi gudang, marker akan muncul di map.</p>

    <div class="warehouse-form">
        <input type="text" id="warehouseName" placeholder="Nama Gudang">
        <input type="text" id="warehouseLat" placeholder="Latitude">
        <input type="text" id="warehouseLng" placeholder="Longitude">
        <button id="btnAddWarehouse">Tambahkan Gudang</button>
    </div>
</section>

<!-- ================= MAP ================= -->
<section class="map-section">
    <div id="map"></div>
</section>

<!-- ================= UPLOAD CSV ================= -->
<section class="upload-section">
    <div class="upload-card">
        <h3>📄 Upload Data Outlet (CSV)</h3>
        <p class="upload-desc">
            Upload file CSV berisi daftar outlet untuk ditampilkan di map.
        </p>

        <form class="upload-form" enctype="multipart/form-data">
            @csrf

            <label class="upload-box">
                <input type="file" id="csvFile" accept=".csv">
                <div class="upload-content">
                    <span class="upload-icon">📂</span>
                    <strong>Klik untuk upload</strong>
                    <small>atau drag & drop file CSV</small>
                </div>
            </label>

            <button type="submit" class="btn-upload">
                ⬆️ Upload CSV
            </button>

            <div class="upload-hint">
                Format file: <code>nama_toko, latitude, longitude</code>
            </div>
        </form>
    </div>
</section>



<section class="result-section">
    <div class="result-card">
        <h3>📋 Hasil Upload CSV</h3>

        <table id="resultTable">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama Outlet</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="4" class="empty-text">
                        Belum ada data
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</section>


<!-- ================= FOOTER ================= -->
<footer>
    © {{ date('Y') }} Halocoko — Distribution Route System
</footer>

<!-- ================= SCRIPT ================= -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="{{ asset('js/homepagekiriman.js') }}"></script>

</body>
</html>
