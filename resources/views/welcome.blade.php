<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Halocoko Route</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="{{ asset('css/welcome.css') }}">
</head>
<body>

<div class="overlay"></div>

<section class="welcome">
    <h1>Selamat Datang di Halocoko Route</h1>
    <p>
        Platform pemetaan rute modern untuk membantu perjalananmu
        menjadi lebih cepat, akurat, dan efisien.
    </p>

    <div class="btn-group">
        <!-- MULAI MAPPING -->
        <a href="{{ route('login', ['redirect' => 'map']) }}" class="btn-start">
            🗺️ Mulai Mapping
        </a>

        <!-- BUAT RUTE KIRIMAN -->
        <a href="{{ route('login', ['redirect' => 'kiriman']) }}" class="btn-secondary">
            🚚 Buat Rute Kiriman
        </a>

    </div>
</section>

<script src="{{ asset('js/welcome.js') }}"></script>
</body>
</html>
