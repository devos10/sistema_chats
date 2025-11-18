<?php
require_once __DIR__ . '/conexion.php';

// Función para buscar usuarios que NO sean contacto ni el usuario actual 
function buscarUsuariosNoContactos(string $busqueda, int $usuario_id): array {
    $pdo = getConnection();
    
    $sql = '
        SELECT id_usuario, usuario, fecha_creacion
        FROM usuario
        WHERE usuario LIKE :busqueda
          AND id_usuario != :usuario_id
          AND id_usuario NOT IN (
              SELECT contacto_id 
              FROM contacto 
              WHERE usuario_id = :usuario_id2
          )
        LIMIT 10
    ';
    
    $stmt = $pdo->prepare($sql);

    $busqueda_param = "%$busqueda%";
    
    $stmt->execute([
        'busqueda'    => $busqueda_param,
        'usuario_id'  => $usuario_id,
        'usuario_id2' => $usuario_id
    ]);
    
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
