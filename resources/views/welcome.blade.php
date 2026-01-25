<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Halocoko Route</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="{{ asset('css/welcome.css') }}">
</head>
<body>

<!-- BACKGROUND OVERLAY -->
<div class="overlay"></div>

<!-- DECOR BLUR -->
<div class="decor decor-1"></div>
<div class="decor decor-2"></div>

<section class="welcome">

    <!-- BADGE -->
    <div class="badge">
        🚀 Smart Distribution System
    </div>

    <!-- TITLE -->
    <h1>Halocoko Route</h1>

    <!-- SUBTITLE -->
    <p class="subtitle">
        Platform pemetaan rute modern untuk membantu pengiriman menjadi
        <b>lebih cepat</b>, <b>lebih akurat</b>, dan <b>lebih efisien</b>.
    </p>

    <!-- FEATURE LIST -->
    <div class="features">
        <div class="feature-card">
            <div class="icon">🗺️</div>
            <h3>Mapping Gudang & Outlet</h3>
            <p>Visualisasi lokasi gudang dan outlet langsung di peta interaktif.</p>
        </div>

        <div class="feature-card">
            <div class="icon">📍</div>
            <h3>Optimasi Rute</h3>
            <p>Rute pengiriman lebih singkat dan efisien secara otomatis.</p>
        </div>

        <div class="feature-card">
            <div class="icon">📊</div>
            <h3>Data Terstruktur</h3>
            <p>Upload CSV dan kelola data outlet dengan rapi.</p>
        </div>
    </div>

    <!-- BUTTON -->
    <div class="btn-group">
        <a href="{{ route('login', ['redirect' => 'map']) }}" class="btn-start active">
            🗺️ Mulai Mapping
        </a>

        <a href="{{ route('login', ['redirect' => 'kiriman']) }}" class="btn-secondary">
            🚚 Buat Rute Kiriman
        </a>
    </div>

    <!-- FOOT NOTE -->
    <div class="footnote">
        Digunakan oleh tim distribusi Halocoko © {{ date('Y') }}
    </div>

</section>

<script src="{{ asset('js/welcome.js') }}"></script>
</body>
</html>
