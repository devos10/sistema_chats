<!DOCTYPE html>
<html lang="en">
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
    
</body>
</html>
