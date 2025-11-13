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
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required><br><br>
        
        <label for="password">Password:</label>
        <input type="password" id="email" name="password" required><br><br>
        
        <label for="password_confirm">Confirmar Password:</label>
        <input type="password" id="password" name="password_confirm" required><br><br>
        
        <input type="submit" value="Registrarse">
    </form>
    <a href="index.php">Volver al Login</a>
    
</body>
</html>
