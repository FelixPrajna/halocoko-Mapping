<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Dashboard Halocoko</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Leaflet -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>

    <!-- Custom CSS -->
    <link rel="stylesheet" href="{{ asset('css/dashboard.css') }}">
</head>
<body>

<!-- ================= NAVBAR ================= -->
<nav class="navbar">
    <div class="logo">🗺️ Halocoko Dashboard</div>

    <div class="nav-right">
        <div class="user-info">
            <span class="user-name">{{ auth()->user()->name }}</span>
            <span class="user-email">{{ auth()->user()->email }}</span>
        </div>

        <a href="{{ route('map') }}" class="btn-back">Back</a>

        <form action="{{ url('/logout') }}" method="POST">
            @csrf
            <button class="btn-logout" type="submit">Logout</button>
        </form>
    </div>
</nav>

<!-- ================= CONTENT ================= -->
<div class="content">
    <h1>Dashboard Gudang</h1>
    <p>Masukkan lokasi gudang di bawah, dan marker akan muncul di map.</p>

    <!-- ===== FORM GUDANG ===== -->
    <div class="warehouse-form">
        <input type="text" id="warehouse-name" placeholder="Nama Gudang">
        <input type="number" step="any" id="warehouse-lat" placeholder="Latitude">
        <input type="number" step="any" id="warehouse-lng" placeholder="Longitude">
        <button id="addWarehouseBtn">Tambahkan Gudang</button>
    </div>

    <!-- ===== MAP GUDANG ===== -->
    <div id="warehouse-map"></div>

    <!-- ================= UPLOAD SECTION ================= -->
    <div class="upload-section">
        <h2>Upload Data Outlet</h2>

        <form enctype="multipart/form-data" method="POST" action="{{ route('outlet.upload') }}">
            @csrf

            <label for="fileInput" class="upload-label">
    <div class="folder-icon"></div>

    <span>
        Klik untuk upload file<br>
        <strong>CSV / Excel</strong>
    </span>
</label>


            <input type="file" id="fileInput" name="file" accept=".csv,.xlsx,.xls" required>

            <button type="submit" class="btn-upload">Upload</button>
        </form>

        @if(session('success'))
            <p class="success-msg">{{ session('success') }}</p>
        @endif
    </div>

    <!-- ================= DATA OUTLET DROPDOWN ================= -->
    <div class="data-wrapper" id="dataWrapper">
        <div class="data-header" id="toggleData">
            <span>📍 Data Outlet ({{ $outlets->count() }})</span>
            <span class="arrow">▼</span>
        </div>

        <div class="data-content">
            @if($outlets->count())
            <table class="data-table">
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
                <p class="empty-text">Belum ada data outlet.</p>
            @endif
        </div>
    </div>
</div>

<!-- ================= SCRIPT ================= -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="{{ asset('js/dashboard.js') }}"></script>

<script>
    // Toggle dropdown Data Outlet
    const toggle = document.getElementById('toggleData');
    const wrapper = document.getElementById('dataWrapper');

    toggle.addEventListener('click', () => {
        wrapper.classList.toggle('open');
    });
</script>

</body>
</html>
