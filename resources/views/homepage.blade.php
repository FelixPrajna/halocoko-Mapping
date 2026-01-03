<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Halocoko Route Map</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Leaflet CSS -->
    <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-o9N1j7kPp4J8G1wLk3xVvP4Nl+KpLrY8Rk4bZ8Jrjv0="
        crossorigin=""
    />

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

        <!-- CREATE (GET, BUKAN FORM) -->
        <a href="{{ url('/create') }}" class="btn-create">
            Create
        </a>

        <!-- LOGOUT (POST SAJA UNTUK LOGOUT) -->
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
    <button type="button" id="btnRoute">Tampilkan Rute</button>
</div>

<!-- Leaflet JS -->
<script
    src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    integrity="sha256-o8Ee2Z7kzY7S4h2z4x7kKpK7Q5lYkLQbRkP1R0XH0k0="
    crossorigin=""
></script>

<!-- Custom JS -->
<script src="{{ asset('js/homepage.js') }}"></script>

</body>
</html>
