<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Dashboard Halocoko</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="{{ asset('css/dashboard.css') }}">
</head>
<body>
    <nav class="navbar">
        <div class="logo">🗺️ Halocoko Dashboard</div>
        <div class="nav-right">
            <div class="user-info">
                <span class="user-name">{{ auth()->user()->name }}</span>
                <span class="user-email">{{ auth()->user()->email }}</span>
            </div>

            <!-- Tombol Back -->
            <form action="/map" method="GET">
                <button class="btn-back" type="submit">Back</button>
            </form>

            <form action="/logout" method="POST">
                @csrf
                <button class="btn-logout" type="submit">Logout</button>
            </form>
        </div>
    </nav>

    <div class="content">
        <h1>Selamat Datang di Dashboard</h1>
        <p>Ini halaman baru yang muncul ketika tombol Create ditekan.</p>
    </div>
</body>
</html>
