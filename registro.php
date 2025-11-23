<?php
session_start();
?>
<!DOCTYPE html>
<html lang="es-MX">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro</title>
    <link rel="stylesheet" href="css/styles.css">
</head>

<body>
    <div class="container">
        <h2>Registro</h2>
        
        <div id="errorContainer" class="error-message" style="display: none;"></div>
        
        <form id="formRegistro" action="procesos/registrar.php" method="POST" onsubmit="return validarFormulario(event)">
            <label for="usuario">Usuario:</label>
            <input type="text" id="usuario" name="usuario" required minlength="3" maxlength="50">
            <small style="display: block; margin-top: -15px; margin-bottom: 15px; color: #666;">Mínimo 3 caracteres</small>
            
            <label for="contraseña">Contraseña:</label>
            <div class="input-group">
                <input type="password" id="contraseña" name="contraseña" required oninput="validarContraseña()">
                <button type="button" class="toggle-pw-perfil" onclick="togglePassword('contraseña', this)">Mostrar</button>
            </div>
            
            <div class="password-requirements">
                <h4>La contraseña debe contener:</h4>
                <div class="requirement" id="req-length">
                    <span class="requirement-icon">○</span>
                    <span>Mínimo 8 caracteres</span>
                </div>
                <div class="requirement" id="req-uppercase">
                    <span class="requirement-icon">○</span>
                    <span>Al menos una letra mayúscula</span>
                </div>
                <div class="requirement" id="req-lowercase">
                    <span class="requirement-icon">○</span>
                    <span>Al menos una letra minúscula</span>
                </div>
                <div class="requirement" id="req-number">
                    <span class="requirement-icon">○</span>
                    <span>Al menos un número</span>
                </div>
                <div class="password-strength">
                    <div id="strengthBar" class="password-strength-bar"></div>
                </div>
                <small id="strengthText" style="display: block; margin-top: 5px; color: #666;"></small>
            </div>
            
            <label for="contraseña_confirmar">Confirmar Contraseña:</label>
            <div class="input-group">
                <input type="password" id="contraseña_confirmar" name="contraseña_confirmar" required oninput="verificarCoincidencia()">
                <button type="button" class="toggle-pw-perfil" onclick="togglePassword('contraseña_confirmar', this)">Mostrar</button>
            </div>
            <small id="matchMessage" style="display: block; margin-top: -15px; margin-bottom: 15px;"></small>
            
            <input type="submit" value="Registrarse">
        </form>
        <a href="index.php" class="btn-secondary">Volver al Login</a>
    </div>

    <?php include 'includes/alertas.php'; ?>
    
    <script src="js/app.js"></script>
</body>

</html>