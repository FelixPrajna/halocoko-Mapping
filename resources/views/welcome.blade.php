<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Welcome | Laravel 12</title>

    <style>
        body {
            margin: 0;
            font-family: 'Segoe UI', Tahoma, sans-serif;
            background: linear-gradient(135deg, #ff6a00, #ee0979);
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .card {
            background: #ffffff;
            padding: 40px;
            border-radius: 15px;
            width: 400px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            animation: fadeIn 1s ease-in-out;
        }

        h1 {
            color: #ee0979;
            margin-bottom: 5px;
        }

        .wave {
            display: inline-block;
            transform-origin: 70% 70%;
            animation: wave-hand 2s infinite;
        }

        @keyframes wave-hand {
            0% { transform: rotate(0deg); }
            10% { transform: rotate(14deg); }
            20% { transform: rotate(-8deg); }
            30% { transform: rotate(14deg); }
            40% { transform: rotate(-4deg); }
            50% { transform: rotate(10deg); }
            60% { transform: rotate(0deg); }
            100% { transform: rotate(0deg); }
        }

        .clock {
            font-size: 26px;
            font-weight: bold;
            color: #ff6a00;
            margin-bottom: 3px;
        }

        .timezone {
            font-size: 13px;
            color: #999;
            margin-bottom: 15px;
        }

        p {
            color: #555;
            margin-bottom: 20px;
        }

        .btn {
            display: inline-block;
            padding: 12px 25px;
            background: linear-gradient(135deg, #ff6a00, #ee0979);
            color: #fff;
            text-decoration: none;
            border-radius: 30px;
            font-weight: bold;
            transition: 0.3s;
        }

        .btn:hover {
            opacity: 0.85;
            transform: scale(1.05);
        }

        .date {
            margin-top: 20px;
            font-size: 14px;
            color: #888;
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

    <div class="card">
        <h1>
            Selamat Datang 
            <span class="wave">👋</span>
        </h1>

        <!-- JAM WIB -->
        <div class="clock" id="clock">00:00:00</div>
        <div class="timezone">Waktu Indonesia Barat (WIB)</div>

        <p>
            Aplikasi ini dibuat menggunakan <strong>Laravel 12</strong>.
            Welcome page ini sederhana, berwarna, dan menarik.
        </p>

        <a href="{{ route('login') }}" class="btn">Mulai Sekarang</a>

        <div class="date">
            {{ now()->format('d F Y') }}
        </div>
    </div>

    <script>
        function updateClock() {
            const now = new Date();
            const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
            const wib = new Date(utc + (7 * 60 * 60 * 1000));

            const h = String(wib.getHours()).padStart(2, '0');
            const m = String(wib.getMinutes()).padStart(2, '0');
            const s = String(wib.getSeconds()).padStart(2, '0');

            document.getElementById('clock').innerText = `${h}:${m}:${s}`;
        }

        setInterval(updateClock, 1000);
        updateClock();
    </script>

</body>
</html>
