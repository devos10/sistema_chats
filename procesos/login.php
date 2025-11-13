<?php
// Evita errores si se entra por GET o sin datos
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario    = $_POST['usuario'];
    $contrasena = $_POST['contrasena'];

    echo "Usuario: " . $usuario . " Contraseña: " . $contrasena;
    
} else {
    // Si alguien entra directo a login.php,regresa al formulario
    header('Location: ../index.php'); 
    exit;
}
?>