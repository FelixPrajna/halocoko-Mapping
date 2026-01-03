<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Dashboard Halocoko</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>

    <!-- Custom CSS -->
    <link rel="stylesheet" href="{{ asset('css/dashboard.css') }}">
</head>
<body>
    <!-- NAVBAR -->
    <nav class="navbar">
        <div class="logo">🗺️ Halocoko Dashboard</div>
        <div class="nav-right">
            <div class="user-info">
                <span class="user-name">{{ auth()->user()->name }}</span>
                <span class="user-email">{{ auth()->user()->email }}</span>
            </div>

            <form action="/map" method="GET">
                <button class="btn-back" type="submit">Back</button>
            </form>

            <form action="/logout" method="POST">
                @csrf
                <button class="btn-logout" type="submit">Logout</button>
            </form>
        </div>
    </nav>

    <!-- CONTENT -->
    <div class="content">
        <h1>Dashboard Gudang</h1>
        <p>Masukkan lokasi gudang di bawah, dan marker akan muncul di map.</p>

        <!-- Form Gudang -->
        <div class="warehouse-form">
            <input type="text" id="warehouse-name" placeholder="Nama Gudang">
            <input type="number" step="any" id="warehouse-lat" placeholder="Latitude">
            <input type="number" step="any" id="warehouse-lng" placeholder="Longitude">
            <button id="addWarehouseBtn">Tambahkan Gudang</button>
        </div>

        <!-- Map Gudang -->
        <div id="warehouse-map"></div>
    </div>

    <!-- Leaflet JS -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

    <!-- Custom JS -->
    <script src="{{ asset('js/dashboard.js') }}"></script>
</body>

<!-- Upload Data Outlet -->
<div class="upload-section">
    <h2>Upload Data Outlet</h2>
    <form id="uploadForm" enctype="multipart/form-data" method="POST" action="{{ route('outlet.upload') }}">
    @csrf
    <label for="fileInput" class="upload-label">
        <img src="{{ asset('images/upload-icon.png') }}" alt="Upload Icon" class="upload-icon">
        Klik untuk upload file CSV/Excel
    </label>
    <input type="file" id="fileInput" name="file" accept=".csv,.xlsx,.xls" required>
    <button type="submit" class="btn-upload">Upload</button>
    </form>

    @if(session('success'))
    <p style="color: #fff; margin-top:10px;">{{ session('success') }}</p>
    @endif
    
</div>
<h2>Data Outlet</h2>

@if(isset($outlets) && $outlets->count())
<table border="1" cellpadding="8" cellspacing="0" width="100%">
    <thead>
        <tr>
            <th>No</th>
            <th>Nama Outlet</th>
            <th>Latitude</th>
            <th>Longitude</th>
        </tr>
    </thead>
    <tbody>
        @foreach($outlets as $i => $outlet)
        <tr>
            <td>{{ $i + 1 }}</td>
            <td>{{ $outlet->name }}</td>
            <td>{{ $outlet->latitude }}</td>
            <td>{{ $outlet->longitude }}</td>
        </tr>
        @endforeach
    </tbody>
</table>
@else
<p>Belum ada data outlet.</p>
@endif

</html>
