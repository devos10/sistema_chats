<!DOCTYPE html>
<html lang="es-MX">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
   <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body>
<?php if (isset($_GET['logout']) && $_GET['logout'] == 1): ?>
    <p style="color:green;">Has cerrado sesión correctamente.</p>
<?php endif; ?>
    <h2>Login</h2>
    <form action="procesos/login.php" method="POST">
        <label for="usuario">Usuario:</label>
        <input type="text" id="usuario" name="usuario" required><br><br>
        
        <label for="contrasena">Contraseña:</label>
        <input type="password" id="contrasena" name="contrasena" required><br><br>
        
        <input type="submit" value="Login">
    </form>
    <a href="registro.php">Registrarse</a>
    <!--Incluimos el archivo de las alertas-->
    <?php 
    session_start();
    include 'includes/alertas.php'; ?>
  
</body>
</html>