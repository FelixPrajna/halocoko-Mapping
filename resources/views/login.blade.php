<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <link rel="stylesheet" href="{{ asset('css/login.css') }}">
</head>
<body>

<div class="login-box">
    <h2>Login</h2>

    @if ($errors->has('login'))
        <p class="error">{{ $errors->first('login') }}</p>
    @endif

<form method="POST" action="/login">
    @csrf

    <input type="hidden" name="redirect" value="{{ $redirect ?? '' }}">

    <input type="email" name="email" required>
    <input type="password" name="password" required>

    <button type="submit">Login</button>
</form>

</div>

</body>
</html>
