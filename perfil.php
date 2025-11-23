<?php
session_start();
if (!isset($_SESSION['id_usuario'])) {
    header('Location: index.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="es-MX">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Perfil</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <div class="perfil-container">
        <!-- Header -->
        <div class="perfil-header">
            <a href="chat.php" class="back-btn" title="Volver al chat">←</a>
            <div class="perfil-header-info">
                <div class="perfil-avatar-small">👤</div>
                <h1><?php echo htmlspecialchars($_SESSION['usuario']); ?></h1>
            </div>
            <div class="spacer"></div>
        </div>

        <!-- Contenido del perfil -->
        <div class="perfil-content">
            <!-- Formulario de actualización -->
            <div class="perfil-form-section">
                <form action="procesos/actualizar_usuario.php" method="POST" class="perfil-form">
                    <div class="form-section-header">
                        <h3>Actualizar Información</h3>
                    </div>

                    <div class="perfil-form-group">
                        <label for="usuario">Nombre de usuario</label>
                        <div class="input-wrapper">
                            <input 
                                type="text" 
                                id="usuario" 
                                name="usuario" 
                                placeholder="Nuevo nombre de usuario"
                                autocomplete="off">
                        </div>
                    </div>

                    <div class="perfil-form-group">
                        <label for="contraseña">Nueva contraseña</label>
                        <div class="input-wrapper">
                            <input 
                                type="password" 
                                id="contraseña" 
                                name="contraseña" 
                                placeholder="Nueva contraseña"
                                autocomplete="new-password">
                            <button 
                                type="button" 
                                class="toggle-pw-perfil" 
                                onclick="togglePassword('contraseña', this)">
                                Mostrar
                            </button>
                        </div>
                    </div>

                    <div class="perfil-actions">
                        <button type="submit" class="btn-primary">
                            Guardar Cambios
                        </button>
                        <a href="chat.php" class="btn-secondary">
                            Volver al Chat
                        </a>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <?php include 'includes/alertas.php'; ?>
    
    <script src="js/app.js"></script>
</body>
</html>