<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Home | Laravel 12</title>

    <style>
        body {
            margin: 0;
            font-family: 'Segoe UI', Tahoma, sans-serif;
            background: linear-gradient(135deg, #1d2671, #c33764);
            min-height: 100vh;
            color: #333;
        }

        /* NAVBAR */
        .navbar {
            background: rgba(255,255,255,0.95);
            padding: 15px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .navbar h2 {
            margin: 0;
            color: #c33764;
        }

        .clock {
            font-weight: bold;
            color: #1d2671;
            font-size: 18px;
        }

        .navbar form button {
            background: #c33764;
            color: #fff;
            border: none;
            padding: 8px 18px;
            border-radius: 20px;
            cursor: pointer;
            font-weight: bold;
            transition: 0.3s;
        }

        .navbar form button:hover {
            opacity: 0.85;
        }

        /* CONTENT */
        .container {
            padding: 50px;
            display: flex;
            justify-content: center;
        }

        .card {
            background: #fff;
            width: 100%;
            max-width: 720px;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 15px 40px rgba(0,0,0,0.25);
            animation: fadeIn 0.8s ease-in-out;
            text-align: center;
        }

        .card h1 {
            color: #1d2671;
            margin-bottom: 10px;
        }

        .card p {
            color: #555;
            margin-bottom: 30px;
        }

        .info {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .info-box {
            background: linear-gradient(135deg, #ff6a00, #ee0979);
            color: #fff;
            padding: 20px;
            width: 180px;
            border-radius: 15px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }

        .info-box h3 {
            margin: 0 0 5px;
            font-size: 22px;
        }

        .info-box span {
            font-size: 14px;
            opacity: 0.9;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
</head>
<body>

    <!-- NAVBAR -->
    <div class="navbar">
        <h2>Laravel 12 App</h2>

        <!-- JAM WIB -->
        <div class="clock" id="clock">00:00:00 WIB</div>

        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit">Logout</button>
        </form>
    </div>

    <!-- CONTENT -->
    <div class="container">
        <div class="card">
            <h1>Halo, {{ auth()->user()->name }} 👋</h1>

            <p>
                Kamu berhasil login ke aplikasi <strong>Laravel 12</strong>.
                Halaman ini dilindungi oleh authentication.
            </p>

            <div class="info">
                <div class="info-box">
                    <h3>{{ now()->format('d') }}</h3>
                    <span>Tanggal</span>
                </div>

                <div class="info-box">
                    <h3>{{ now()->format('F') }}</h3>
                    <span>Bulan</span>
                </div>

                <div class="info-box">
                    <h3>{{ now()->format('Y') }}</h3>
                    <span>Tahun</span>
                </div>
            </div>
        </div>
    </div>

    <script>
        function updateClock() {
            const now = new Date();

            // WIB = UTC +7
            const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
            const wib = new Date(utc + (7 * 60 * 60 * 1000));

            const h = String(wib.getHours()).padStart(2, '0');
            const m = String(wib.getMinutes()).padStart(2, '0');
            const s = String(wib.getSeconds()).padStart(2, '0');

            document.getElementById('clock').innerText =
                `${h}:${m}:${s} WIB`;
        }

        setInterval(updateClock, 1000);
        updateClock();
    </script>

</body>
</html>
