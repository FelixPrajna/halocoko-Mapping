<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Halocoko | Rute Kiriman</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

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
                <button class="btn-logout" type="submit">Logout</button>
            </form>
        </div>
    </div>
</nav>

<!-- ================= HERO ================= -->
<section class="hero">
    <h1>Dashboard Gudang</h1>
    <p>Masukkan lokasi gudang, marker akan muncul di peta.</p>

    <div class="warehouse-form">
        <input type="text" id="warehouseName" placeholder="Nama Gudang">
        <input type="text" id="warehouseLat" placeholder="Latitude">
        <input type="text" id="warehouseLng" placeholder="Longitude">
        <button type="button" id="btnAddWarehouse">Tambah Gudang</button>
    </div>
</section>

<!-- ================= MAP ================= -->
<section class="map-section">
    <div id="map"></div>
</section>

<!-- ================= UPLOAD FILE ================= -->
<section class="upload-section">
    <div class="upload-card">

        <h3>📄 Upload Data Outlet</h3>
        <p class="upload-desc">
            Upload file <strong>CSV atau Excel (.xlsx)</strong>.
            Data akan diproses setelah tombol Upload ditekan.
        </p>

        <div class="upload-ui">

            <!-- FILE PICKER -->
            <div class="file-picker">
                <input
                    type="file"
                    id="fileInput"
                    accept=".csv,.xlsx"
                    hidden
                >

                <button
                    type="button"
                    id="btnChooseFile"
                    class="btn-choose"
                >
                    📂 Pilih File
                </button>

                <span id="fileNameText" class="file-name">
                    Belum ada file dipilih
                </span>
            </div>

            <!-- UPLOAD BUTTON -->
            <button
                type="button"
                id="btnUpload"
                class="btn-upload"
                disabled
            >
                ⬆️ Upload
            </button>

        </div>

        <div class="upload-hint">
            Kolom wajib:
            <code>
                Kode Toko, Nama Toko, Invoice No,
                Item Produk, Qty, Value, Latitude, Longitude
            </code>
        </div>

    </div>
</section>


<!-- ================= RESULT ================= -->
<section class="result-section">
    <div class="result-card">
        <h3>📋 Hasil Upload</h3>

        <table id="resultTable">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Kode Toko</th>
                    <th>Nama Toko</th>
                    <th>Invoice</th>
                    <th>Item Produk</th>
                    <th>Qty</th>
                    <th>Value</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                </tr>
            </thead>
            <tbody>
                <tr class="empty-row">
                    <td colspan="9">Belum ada data</td>
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
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<script src="{{ asset('js/homepagekiriman.js') }}"></script>

</body>
</html>
