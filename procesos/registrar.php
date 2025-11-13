<?php
//verificar si se ha enviado el formulario
// Evita errores si se entra por GET o sin datos
if ($_SERVER['REQUEST_METHOD'] === 'POST'){
$usuario=$_POST['usuario'];
$contraseña=$_POST['contraseña'];
$contraseña_confirmar=$_POST['contraseña_confirmar'];
 print_r("Usuario: " . $usuario . " Contraseña: " . $contraseña. " Confirmar Contraseña: " . $contraseña_confirmar);

} else {
    // Si alguien entra directo a registrar.php,regresa al formulario
    header('Location: ../registro.php'); 
    exit;
}
?>