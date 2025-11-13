<?php
require_once __DIR__ . '/../db/UsuarioBD.php';
//verificar si se ha enviado el formulario
// Evita errores si se entra por GET o sin datos
if ($_SERVER['REQUEST_METHOD'] === 'POST'){
$usuario=$_POST['usuario'];
$contrasena=$_POST['contraseña'];
$contrasena_confirmar=$_POST['contraseña_confirmar'];
//validar que las contraseñas coincidan 
    if($contrasena !== $contrasena_confirmar){
        echo "Las contraseñas no coinciden.";
        exit;
    }else{
        //crear el usuario
        $resultado=crearUsuario($usuario,$contrasena);
        if($resultado){
            echo "Usuario creado exitosamente.";
        }else{
            echo "Error al crear el usuario.";
        }
    }

} else {
    // Si alguien entra directo a registrar.php,regresa al formulario
    header('Location: ../registro.php'); 
    exit;
}
?>