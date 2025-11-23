// Variables globales
let chatActivo = null;
let intervaloActualizacion = null;
let intervaloConversaciones = null;
let ultimoTotalMensajes = 0;
let timeoutBusqueda = null;

// Inicializar cuando carga la página
document.addEventListener("DOMContentLoaded", function () {
  cargarConversaciones();

  // Actualizar conversaciones cada 0.5 segundos
  intervaloConversaciones = setInterval(cargarConversaciones, 3000);

  // Solicitar permiso para notificaciones
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }

  // Cerrar menú al hacer clic fuera
  document.addEventListener("click", function (e) {
    const menu = document.getElementById("dropdownMenu");
    const menuBtn = e.target.closest(".icon-btn");
    if (menu && !menu.contains(e.target) && !menuBtn) {
      menu.classList.remove("show");
    }
  });

  // Búsqueda automática mientras escribe
  const inputBusqueda = document.getElementById("terminoBusqueda");
  inputBusqueda.addEventListener("input", function() {
    // Limpiar timeout anterior
    if (timeoutBusqueda) {
      clearTimeout(timeoutBusqueda);
    }
    
    // Esperar 300ms después de que el usuario deje de escribir
    timeoutBusqueda = setTimeout(() => {
      buscarUsuarios();
    }, 300);
  });
});

// Toggle menú desplegable
function toggleMenu() {
  const menu = document.getElementById("dropdownMenu");
  menu.classList.toggle("show");
}

// Cargar lista de conversaciones
function cargarConversaciones() {
  fetch("./procesos/obtener_conversaciones.php", {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        mostrarConversaciones(data.conversaciones);
        verificarNuevosMensajes(data.conversaciones);
      }
    })
    .catch((error) => console.error("Error:", error));
}

// Mostrar conversaciones en la lista
function mostrarConversaciones(conversaciones) {
  const contenedor = document.getElementById("listaConversaciones");

  if (conversaciones.length === 0) {
    contenedor.innerHTML =
      '<div class="sin-conversaciones">No tienes conversaciones aún.<br>Busca usuarios para iniciar un chat.</div>';
    return;
  }

  let html = "";
  conversaciones.forEach((conv) => {
    const mensajeCorto = conv.ultimo_mensaje
      ? conv.ultimo_mensaje.length > 50
        ? conv.ultimo_mensaje.substring(0, 50) + "..."
        : conv.ultimo_mensaje
      : "Sin mensajes";

    const badgeHtml =
      conv.mensajes_sin_leer > 0
        ? `<div class="badge-no-leidos">${conv.mensajes_sin_leer}</div>`
        : "";

    const activeClass =
      chatActivo && chatActivo.id === conv.id_usuario ? "active" : "";

    html += `
            <div class="conversacion-item ${activeClass}" onclick="iniciarChat(${conv.id_usuario}, '${conv.usuario}')">
                <div class="conversacion-info">
                    <div class="conversacion-nombre">${conv.usuario}</div>
                    <div class="conversacion-ultimo">${escapeHtml(
                      mensajeCorto
                    )}</div>
                </div>
                ${badgeHtml}
            </div>
        `;
  });

  contenedor.innerHTML = html;
}

// Verificar si hay nuevos mensajes y mostrar notificación
function verificarNuevosMensajes(conversaciones) {
  const totalMensajesNuevos = conversaciones.reduce(
    (total, conv) => total + parseInt(conv.mensajes_sin_leer),
    0
  );

  // Si hay más mensajes que antes, mostrar notificación
  if (totalMensajesNuevos > ultimoTotalMensajes && ultimoTotalMensajes !== 0) {
    const conversacionConNuevos = conversaciones.find(
      (c) => c.mensajes_sin_leer > 0
    );

    if (conversacionConNuevos) {
      mostrarNotificacion(
        conversacionConNuevos.usuario,
        conversacionConNuevos.ultimo_mensaje || "Nuevo mensaje"
      );
    }
  }

  ultimoTotalMensajes = totalMensajesNuevos;

  // Actualizar título de la página
  if (totalMensajesNuevos > 0) {
    document.title = `(${totalMensajesNuevos}) Sistema de Chat`;
  } else {
    document.title = "Sistema de Chat";
  }
}

// Mostrar notificación del navegador
function mostrarNotificacion(titulo, mensaje) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(titulo, {
      body: mensaje,
      icon: "💬",
      badge: "💬",
    });
  }
}

// Buscar usuarios
function buscarUsuarios() {
  const termino = document.getElementById("terminoBusqueda").value.trim();
  
  if (termino === "") {
    cerrarBusqueda();
    return;
  }

  const formData = new FormData();
  formData.append("termino", termino);

  fetch("./procesos/buscar_usuario.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        mostrarResultados(data.resultados);
      } else {
        alert(data.error || "Error en la búsqueda");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error al realizar la búsqueda");
    });
}

// Mostrar resultados de búsqueda
function mostrarResultados(resultados) {
  const contenedor = document.getElementById("resultadosBusqueda");
  const lista = document.getElementById("listaResultados");

  if (resultados.length > 0) {
    let html = "<ul>";
    resultados.forEach((usuario) => {
      html += `<li>
                <div>
                    <strong>${usuario.usuario}</strong>
                    <small style="display:block; color: #666;">Se unió: ${usuario.fecha_creacion}</small>
                </div>
                <button onclick="iniciarChat(${usuario.id_usuario}, '${usuario.usuario}')">💬 Chatear</button>
            </li>`;
    });
    html += "</ul>";
    lista.innerHTML = html;
  } else {
    lista.innerHTML =
      "<p style='padding: 20px; text-align: center; color: #666;'>No se encontraron usuarios.</p>";
  }

  contenedor.classList.add("show");
}

// Cerrar búsqueda
function cerrarBusqueda() {
  const contenedor = document.getElementById("resultadosBusqueda");
  const input = document.getElementById("terminoBusqueda");
  contenedor.classList.remove("show");
  input.value = "";
}

// Iniciar chat con un usuario
function iniciarChat(idUsuario, nombreUsuario) {
  chatActivo = {
    id: idUsuario,
    nombre: nombreUsuario,
  };

  // Ocultar pantalla de bienvenida
  const welcomeScreen = document.getElementById("welcomeScreen");
  const chatWindow = document.getElementById("chatWindow");

  welcomeScreen.classList.add("hidden");
  chatWindow.classList.add("active");

  // Actualizar nombre del contacto
  document.getElementById("nombreContacto").textContent = nombreUsuario;

  // Cerrar búsqueda si está abierta
  cerrarBusqueda();

  // Cargar mensajes
  cargarMensajes();

  // Actualizar mensajes cada 0.5 segundos
  if (intervaloActualizacion) {
    clearInterval(intervaloActualizacion);
  }
  intervaloActualizacion = setInterval(cargarMensajes, 3000);

  // Actualizar lista de conversaciones
  setTimeout(cargarConversaciones, 3000);

  // Focus en el input
  document.getElementById("inputMensaje").focus();
}

// Cerrar ventana de chat
function cerrarChat() {
  const welcomeScreen = document.getElementById("welcomeScreen");
  const chatWindow = document.getElementById("chatWindow");

  welcomeScreen.classList.remove("hidden");
  chatWindow.classList.remove("active");

  if (intervaloActualizacion) {
    clearInterval(intervaloActualizacion);
  }

  chatActivo = null;

  // Actualizar conversaciones para quitar la clase active
  cargarConversaciones();
}

// Cargar mensajes de la conversación
function cargarMensajes() {
  if (!chatActivo) return;

  const formData = new FormData();
  formData.append("id_contacto", chatActivo.id);

  fetch("./procesos/obtener_mensaje.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        mostrarMensajes(data.mensajes);
      }
    })
    .catch((error) => console.error("Error:", error));
}

// Mostrar mensajes en pantalla
function mostrarMensajes(mensajes) {
  const contenedor = document.getElementById("mensajesContenedor");
  const scrollAnterior = contenedor.scrollHeight - contenedor.scrollTop;

  if (mensajes.length === 0) {
    contenedor.innerHTML =
      '<div class="no-messages">No hay mensajes. ¡Inicia la conversación!</div>';
    return;
  }

  let html = "";
  mensajes.forEach((msg) => {
    const esMio = msg.de_usuario_id != chatActivo.id;
    const tipoMensaje = esMio ? "sent" : "received";

    const fecha = new Date(msg.fecha_creacion);
    const hora = fecha.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    });

    html += `
            <div class="message-bubble ${tipoMensaje}">
                <div class="message-content">
                    <p class="message-text">${escapeHtml(msg.mensaje)}</p>
                    <div class="message-time">${hora}</div>
                </div>
            </div>
        `;
  });

  contenedor.innerHTML = html;

  // Hacer scroll solo si estábamos cerca del final
  if (scrollAnterior < 150) {
    contenedor.scrollTop = contenedor.scrollHeight;
  }
}

// Enviar mensaje
function enviarMensaje() {
  if (!chatActivo) return;

  const input = document.getElementById("inputMensaje");
  const mensaje = input.value.trim();

  if (mensaje === "") return;

  const formData = new FormData();
  formData.append("id_destinatario", chatActivo.id);
  formData.append("mensaje", mensaje);

  fetch("./procesos/enviar_mensaje.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        input.value = "";
        cargarMensajes();
        cargarConversaciones();
      } else {
        alert("Error al enviar: " + (data.error || "Error desconocido"));
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error al enviar el mensaje");
    });
}

// Función para escapar HTML (prevenir XSS)
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Ocultar o mostrar contraseña (para login/registro)
function togglePassword(inputId, button) {
  const pw = inputId
    ? document.getElementById(inputId)
    : document.getElementById("contrasena");
  const btn = button ? button : document.querySelector(".toggle-pw");

  if (pw.type === "password") {
    pw.type = "text";
    btn.textContent = "Ocultar";
  } else {
    pw.type = "password";
    btn.textContent = "Mostrar";
  }
}