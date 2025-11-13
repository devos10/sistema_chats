<?php
session_start();
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
        if(obtenerUsuarioPorNombre($usuario)){
            header('Location: ../registro.php');
             $_SESSION['error_registro'] = "El nombre de usuario ya existe. Por favor elige otro.";
             header('Location: ../registro.php');
            exit;
        }else{
             //crear el usuario
        $resultado=crearUsuario($usuario,$contrasena);
        if($resultado){
             header('Location: ../index.php');
             $_SESSION['exito_creacion'] = "Usuario creado exitosamente. Ahora puedes iniciar sesión.";
             header('Location: ../index.php');
            
        }else{
             header('Location: ../registro.php');
             $_SESSION['error_creacion'] = "Error al crear el usuario. Inténtalo de nuevo.";
             header('Location: ../registro.php');
        }

        }
       
    }

} else {
    // Si alguien entra directo a registrar.php,regresa al formulario
    header('Location: ../registro.php'); 
    exit;
}
?>