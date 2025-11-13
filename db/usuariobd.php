<?php 
require_once __DIR__.'conexion.php';

function crearUsuario($usuario, $contraseñaPlano) {
    $pdo = getConnection();

    // Hash de contraseña
    $contraseñaHash = password_hash($contraseñaPlano, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare('INSERT INTO usuarios (usuario, contraseña) VALUES (:usuario, :contraseña)');
    return $stmt->execute([
        'usuario'  => $usuario,
        'password' => $contraseñaHash
    ]);
}

?>