<?php
//verificar si se ha enviado el formulario
$usuario=$_POST['usuario'];
$contraseña=$_POST['contraseña'];
$contraseña_confirmar=$_POST['contraseña_confirmar'];
 print_r("Usuario: " . $usuario . " Contraseña: " . $contraseña. " Confirmar Contraseña: " . $contraseña_confirmar);
?>