<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Halocoko Map</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="{{ asset('css/homepage.css') }}">
</head>
<body>

<!-- NAVBAR -->
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

<!-- MAP -->
<div id="map"></div>

<!-- PANEL -->
<div class="panel">
    <h3>Mapping Rute</h3>
    <button id="btnRoute">Tampilkan Rute</button>
</div>

<!-- Leaflet JS -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<!-- Custom JS -->
<script src="{{ asset('js/homepage.js') }}"></script>

</body>
</html>
