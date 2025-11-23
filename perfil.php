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
                <div id="errorContainerPerfil" class="error-message" style="display: none;"></div>
                
                <form id="formPerfil" action="procesos/actualizar_usuario.php" method="POST" onsubmit="return validarFormularioPerfil(event)">
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
                                minlength="3"
                                maxlength="50"
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
                                autocomplete="new-password"
                                oninput="validarContraseñaPerfil()">
                            <button 
                                type="button" 
                                class="toggle-pw-perfil" 
                                onclick="togglePassword('contraseña', this)">
                                Mostrar
                            </button>
                        </div>
                   </div>

                    <div class="password-requirements" id="passwordRequirementsPerfil" style="display: none;">
                        <h4>La contraseña debe contener:</h4>
                        <div class="requirement" id="req-length-perfil">
                            <span class="requirement-icon">○</span>
                            <span>Mínimo 8 caracteres</span>
                        </div>
                        <div class="requirement" id="req-uppercase-perfil">
                            <span class="requirement-icon">○</span>
                            <span>Al menos una letra mayúscula</span>
                        </div>
                        <div class="requirement" id="req-lowercase-perfil">
                            <span class="requirement-icon">○</span>
                            <span>Al menos una letra minúscula</span>
                        </div>
                        <div class="requirement" id="req-number-perfil">
                            <span class="requirement-icon">○</span>
                            <span>Al menos un número</span>
                        </div>
                        <div class="password-strength">
                            <div id="strengthBarPerfil" class="password-strength-bar"></div>
                        </div>
                        <small id="strengthTextPerfil" style="display: block; margin-top: 5px; color: #666;"></small>
                    </div>

                    <div class="perfil-form-group" id="confirmPasswordGroup" style="display: none;">
                        <label for="contraseña_confirmar">Confirmar nueva contraseña</label>
                        <div class="input-wrapper">
                            <input 
                                type="password" 
                                id="contraseña_confirmar" 
                                name="contraseña_confirmar" 
                                placeholder="Confirmar nueva contraseña"
                                autocomplete="new-password"
                                oninput="verificarCoincidenciaPerfil()">
                            <button 
                                type="button" 
                                class="toggle-pw-perfil" 
                                onclick="togglePassword('contraseña_confirmar', this)">
                                Mostrar
                            </button>
                        </div>
                        <small id="matchMessagePerfil" style="display: block; margin-top: 5px;"></small>
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