<?php
session_start();
if (isset($_GET['logout']) && $_GET['logout'] == 1) {
    require_once 'includes/agregar_alerta.php';
    alerta('info', 'Has cerrado sesión correctamente.');
}
?>
<!DOCTYPE html>
<html lang="es-MX">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="css/styles.css">
</head>

<body>
    <div class="container">
        <h2>Login</h2>
        <form action="procesos/login.php" method="POST">
            <label for="usuario">Usuario:</label>
            <input type="text" id="usuario" name="usuario" required>

            <label for="contrasena">Contraseña:</label>
            <div class="input-group">
                <input type="password" id="contrasena" name="contrasena" required>
                <button type="button" class="toggle-pw-perfil" onclick="togglePassword('contrasena', this)">Mostrar</button>
            </div>

            <input type="submit" value="Login">
        </form>
        <a href="registro.php" class="btn-secondary">Registrarse</a>
    </div>

    <?php include 'includes/alertas.php'; ?>
    
    <script src="js/app.js"></script>
</body>

</html>