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

?>