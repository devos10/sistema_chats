<!DOCTYPE html>
<html lang="es-MX">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro</title>
</head>
<body>
    <h2>Registro</h2>
    <form action="procesos/registrar.php" method="POST">
        <label for="usuario">Usuario:</label>
        <input type="text" id="usuario" name="usuario" required><br><br>
        
        <label for="contraseña">Contraseña:</label>
        <input type="password" id="contraseña" name="contraseña" required><br><br>
        
        <label for="contraseña_confirmar">Confirmar Contraseña:</label>
        <input type="password" id="contraseña_confirmar" name="contraseña_confirmar" required><br><br>
        
        <input type="submit" value="Registrarse">
    </form>
    <a href="index.php">Volver al Login</a>
    <?php
    session_start();
    if (isset($_SESSION['error_registro'])) {
        echo '<p style="color:red;">' . $_SESSION['error_registro'] . '</p>';
        unset($_SESSION['error_registro']); // para que solo se vea una vez
    }
    if (isset($_SESSION['error_creacion'])) {
        echo '<p style="color:red;">' . $_SESSION['error_creacion'] . '</p>';
        unset($_SESSION['error_creacion']); // para que solo se vea una vez
    }
    ?>
</body>
</html>
