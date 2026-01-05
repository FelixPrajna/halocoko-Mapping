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
    <h1>Selamat Datang di halocoko Route</h1>
    <p>
        Platform pemetaan rute modern untuk membantu perjalananmu
        menjadi lebih cepat, akurat, dan efisien.
    </p>

    <a href="{{ auth()->check() ? '/map' : '/login' }}" class="btn-start">
        Mulai Mapping →
    </a>
</section>

<script src="{{ asset('js/welcome.js') }}"></script>
</body>
</html>
