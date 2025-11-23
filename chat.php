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
    <title>Sistema de Chat</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <div class="chat-container">
        <!-- Panel Izquierdo -->
        <div class="chat-sidebar">
            <!-- Encabezado -->
            <div class="sidebar-header">
                <div class="user-info">
                    <div class="user-avatar">👤</div>
                    <span class="user-name"><?php echo htmlspecialchars($_SESSION['usuario']); ?></span>
                </div>
                <div class="header-actions">
                    <button class="icon-btn" onclick="toggleMenu()" title="Menú">⋮</button>
                    <!-- Menú desplegable -->
                    <div class="dropdown-menu" id="dropdownMenu">
                        <a href="perfil.php">👤 Editar Perfil</a>
                        <a href="logout.php">🚪 Cerrar Sesión</a>
                    </div>
                </div>
            </div>

            <!-- Barra de búsqueda -->
            <div class="search-container">
                <form id="formBusqueda" onsubmit="event.preventDefault(); buscarUsuarios();">
                    <div class="search-box">
                        <input type="text" id="terminoBusqueda" placeholder="Buscar o iniciar chat..." autocomplete="off">
                    </div>
                </form>
            </div>

            <!-- Resultados de búsqueda -->
            <div id="resultadosBusqueda" class="search-results">
                <div class="search-results-header">
                    <span>Resultados de búsqueda</span>
                    <button onclick="cerrarBusqueda()">✕</button>
                </div>
                <div id="listaResultados"></div>
            </div>

            <!-- Lista de conversaciones -->
            <div class="conversations-list" id="listaConversaciones">
                <div class="sin-conversaciones">
                    Cargando conversaciones...
                </div>
            </div>
        </div>

        <!-- Panel Derecho -->
        <div class="chat-main">
            <!-- Pantalla de bienvenida -->
            <div class="welcome-screen" id="welcomeScreen">
                <div class="welcome-content">
                    <div class="welcome-icon">💬</div>
                    <h2>Sistema de Chat</h2>
                    <p>Selecciona una conversación para comenzar a chatear</p>
                    <p class="welcome-hint">Usa la búsqueda para encontrar nuevos contactos</p>
                </div>
            </div>

            <!-- Ventana de chat (oculta inicialmente) -->
            <div class="chat-window" id="chatWindow">
                <!-- Encabezado del chat -->
                <div class="chat-header">
                    <div class="chat-contact-info">
                        <div class="contact-avatar">👤</div>
                        <div class="contact-details">
                            <div class="contact-name" id="nombreContacto"></div>                      
                        </div>
                    </div>
                    <button class="icon-btn" onclick="cerrarChat()" title="Cerrar chat">✕</button>
                </div>

                <!-- Área de mensajes -->
                <div class="messages-container" id="mensajesContenedor">
                    <div class="no-messages">
                        No hay mensajes. ¡Inicia la conversación!
                    </div>
                </div>

                <!-- Input de mensaje -->
                <div class="message-input-container">
                    <input 
                        type="text" 
                        id="inputMensaje" 
                        placeholder="Escribe un mensaje..." 
                        onkeypress="if(event.key === 'Enter') enviarMensaje()"
                        autocomplete="off">
                    <button class="send-btn" onclick="enviarMensaje()">
                        ➤
                    </button>
                </div>
            </div>
        </div>
    </div>

    <?php include 'includes/alertas.php'; ?>
    
    <script src="js/app.js"></script>
</body>
</html>