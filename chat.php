<?php
session_start();
if (!isset($_SESSION['id_usuario'])) {
    // Si no hay sesión activa, redirigir al login
    header('Location: index.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="es-MX">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CHATS</title>
</head>
<body>
<h1>Hola, <?php echo htmlspecialchars($_SESSION['usuario']); ?></h1>
    <h2>Bienvenido al sistema de chats</h2>
    <p>Seleccione un chat para comenzar a conversar.</p>
    <a href="logout.php">Cerrar sesión</a>
    <?php 
    include 'includes/alertas.php'; ?>
</body>
</html>
