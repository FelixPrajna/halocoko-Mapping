<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Halocoko Map</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Leaflet -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>

    <!-- CSS -->
    <link rel="stylesheet" href="{{ asset('css/homepage.css') }}">

    <style>
        body, html {
            margin: 0;
            height: 100%;
        }

        #map {
            width: 100%;
            height: calc(100vh - 60px);
        }

        .filter-box {
            position: absolute;
            top: 80px;
            left: 15px;
            background: white;
            padding: 12px;
            border-radius: 10px;
            z-index: 1000;
            width: 220px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .filter-box label {
            font-weight: bold;
            display: block;
            margin-top: 8px;
        }

        .filter-box select {
            width: 100%;
            margin-top: 5px;
            padding: 6px;
        }
    </style>
</head>
<body>

<!-- ================= NAVBAR ================= -->
<nav class="navbar">
    <div class="logo">🗺️ Halocoko Route</div>

    <div class="nav-right">
        <div class="user-info">
            <span class="user-name">{{ auth()->user()->name }}</span>
            <span class="user-email">{{ auth()->user()->email }}</span>
        </div>

        <a href="{{ route('create') }}" class="btn-create">Create</a>

        <form action="{{ url('/logout') }}" method="POST">
            @csrf
            <button type="submit" class="btn-logout">Logout</button>
        </form>
    </div>
</nav>

<!-- ================= FILTER ================= -->
<div class="filter-box">
    <label>Hari</label>
    <select id="filterDay">
        <option value="">Semua Hari</option>
        <option>Senin</option>
        <option>Selasa</option>
        <option>Rabu</option>
        <option>Kamis</option>
        <option>Jumat</option>
        <option>Sabtu</option>
    </select>

    <label>Sales</label>
    <select id="filterSales">
        <option value="">Semua Sales</option>
    </select>
</div>

<!-- ================= MAP ================= -->
<div id="map"></div>

<!-- ================= SCRIPT ================= -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="{{ asset('js/homepage.js') }}"></script>

</body>
</html>
