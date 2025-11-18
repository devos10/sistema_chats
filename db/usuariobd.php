<?php 
require_once __DIR__.'/conexion.php';

function crearUsuario($usuario, $contrasenaPlano) {
    $pdo = getConnection();

    // Hash de contraseña
    $contrasenaHash = password_hash($contrasenaPlano, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare('INSERT INTO usuario (usuario,contrasena) VALUES (:usuario, :contrasena)');
    return $stmt->execute([
        'usuario'  => $usuario,
        'contrasena' => $contrasenaHash
    ]);
}
//funcion para verificar si el usuario existe
function obtenerUsuarioPorNombre($usuario) {
    $pdo = getConnection();

    $stmt = $pdo->prepare('SELECT * FROM usuario WHERE usuario = :usuario');
    $stmt->execute(['usuario' => $usuario]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

//funcion para obtener usuario por id
function obtenerUsuarioPorId($id) {
    $pdo = getConnection();

    $stmt = $pdo->prepare('SELECT * FROM usuario WHERE id = :id');
    $stmt->execute(['id_usuario' => $id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

?>