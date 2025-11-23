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
  if (inputBusqueda) {
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
  }
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
  const chatMain = document.querySelector(".chat-main");

  welcomeScreen.classList.add("hidden");
  chatWindow.classList.add("active");
  
  // Asegurar que chat-main sea visible en móvil
  if (chatMain) {
    chatMain.style.display = "flex";
  }

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
  const chatMain = document.querySelector(".chat-main");

  welcomeScreen.classList.remove("hidden");
  chatWindow.classList.remove("active");
  
  // Ocultar chat-main en móvil para mostrar sidebar
  if (window.innerWidth <= 768 && chatMain) {
    chatMain.style.display = "none";
  }

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
  const cantidadMensajesAnterior = contenedor.querySelectorAll('.message-bubble').length;
  const scrollAnterior = contenedor.scrollHeight - contenedor.scrollTop;
  const estabaAlFinal = scrollAnterior < 150;

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

  // Hacer scroll automático si:
  // 1. Hay un nuevo mensaje (la cantidad aumentó)
  // 2. O estábamos cerca del final
  const hayNuevoMensaje = mensajes.length > cantidadMensajesAnterior;
  
  if (hayNuevoMensaje || estabaAlFinal) {
    // Usar setTimeout para asegurar que el DOM se actualice primero
    setTimeout(() => {
      contenedor.scrollTop = contenedor.scrollHeight;
    }, 10);
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

// ========== FUNCIONES PARA VALIDACIÓN DE REGISTRO ==========

// Validar contraseña en tiempo real
function validarContraseña() {
  const password = document.getElementById('contraseña').value;
  
  // Requisitos (sin carácter especial)
  const reqLength = password.length >= 8;
  const reqUppercase = /[A-Z]/.test(password);
  const reqLowercase = /[a-z]/.test(password);
  const reqNumber = /[0-9]/.test(password);
  
  // Actualizar visualización de requisitos
  actualizarRequisito('req-length', reqLength);
  actualizarRequisito('req-uppercase', reqUppercase);
  actualizarRequisito('req-lowercase', reqLowercase);
  actualizarRequisito('req-number', reqNumber);
  
  // Calcular fuerza de la contraseña
  const cumplidos = [reqLength, reqUppercase, reqLowercase, reqNumber].filter(Boolean).length;
  const strengthBar = document.getElementById('strengthBar');
  const strengthText = document.getElementById('strengthText');
  
  if (!strengthBar || !strengthText) return; // Si no existen los elementos, salir
  
  strengthBar.className = 'password-strength-bar';
  
  if (cumplidos === 0) {
    strengthBar.classList.remove('strength-weak', 'strength-medium', 'strength-strong');
    strengthText.textContent = '';
  } else if (cumplidos <= 2) {
    strengthBar.classList.add('strength-weak');
    strengthText.textContent = 'Contraseña débil';
    strengthText.style.color = '#dc3545';
  } else if (cumplidos === 3) {
    strengthBar.classList.add('strength-medium');
    strengthText.textContent = 'Contraseña media';
    strengthText.style.color = '#ffc107';
  } else {
    strengthBar.classList.add('strength-strong');
    strengthText.textContent = 'Contraseña fuerte';
    strengthText.style.color = '#28a745';
  }
  
  // Verificar coincidencia si ya escribió en confirmar
  verificarCoincidencia();
}

// Actualizar estado visual de cada requisito
function actualizarRequisito(id, cumple) {
  const elemento = document.getElementById(id);
  if (!elemento) return; // Si no existe el elemento, salir
  
  const icono = elemento.querySelector('.requirement-icon');
  
  if (cumple) {
    elemento.classList.add('valid');
    elemento.classList.remove('invalid');
    icono.textContent = '✓';
  } else {
    elemento.classList.remove('valid');
    elemento.classList.add('invalid');
    icono.textContent = '✗';
  }
}

// Verificar que las contraseñas coincidan
function verificarCoincidencia() {
  const password = document.getElementById('contraseña');
  const confirmPassword = document.getElementById('contraseña_confirmar');
  const matchMessage = document.getElementById('matchMessage');
  
  if (!password || !confirmPassword || !matchMessage) return; // Si no existen, salir
  
  if (confirmPassword.value === '') {
    matchMessage.textContent = '';
    return;
  }
  
  if (password.value === confirmPassword.value) {
    matchMessage.textContent = '✓ Las contraseñas coinciden';
    matchMessage.style.color = '#28a745';
  } else {
    matchMessage.textContent = '✗ Las contraseñas no coinciden';
    matchMessage.style.color = '#dc3545';
  }
}

// Validar formulario antes de enviar
function validarFormulario(event) {
  const password = document.getElementById('contraseña').value;
  const confirmPassword = document.getElementById('contraseña_confirmar').value;
  const usuario = document.getElementById('usuario').value;
  const errorContainer = document.getElementById('errorContainer');
  
  let errores = [];
  
  // Validar usuario
  if (usuario.length < 3) {
    errores.push('El usuario debe tener al menos 3 caracteres');
  }
  
  // Validar contraseña (sin carácter especial)
  if (password.length < 8) {
    errores.push('La contraseña debe tener al menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errores.push('La contraseña debe contener al menos una letra mayúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errores.push('La contraseña debe contener al menos una letra minúscula');
  }
  
  if (!/[0-9]/.test(password)) {
    errores.push('La contraseña debe contener al menos un número');
  }
  
  // Validar coincidencia
  if (password !== confirmPassword) {
    errores.push('Las contraseñas no coinciden');
  }
  
  // Mostrar errores o enviar formulario
  if (errores.length > 0) {
    event.preventDefault();
    errorContainer.innerHTML = '<strong>Errores:</strong><ul style="margin: 10px 0 0 20px;">' + 
      errores.map(e => '<li>' + e + '</li>').join('') + '</ul>';
    errorContainer.style.display = 'block';
    
    // Scroll al error
    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    return false;
  }
  
  errorContainer.style.display = 'none';
  return true;
}

// ========== FUNCIONES PARA VALIDACIÓN DE PERFIL ==========

// Validar contraseña en tiempo real (PERFIL)
function validarContraseñaPerfil() {
  const password = document.getElementById('contraseña').value;
  const requirementsDiv = document.getElementById('passwordRequirementsPerfil');
  const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
  
  // Si el campo está vacío, ocultar validaciones
  if (password === '') {
    requirementsDiv.style.display = 'none';
    confirmPasswordGroup.style.display = 'none';
    return;
  }
  
  // Mostrar validaciones si hay texto
  requirementsDiv.style.display = 'block';
  confirmPasswordGroup.style.display = 'block';
  
  // Requisitos (sin carácter especial)
  const reqLength = password.length >= 8;
  const reqUppercase = /[A-Z]/.test(password);
  const reqLowercase = /[a-z]/.test(password);
  const reqNumber = /[0-9]/.test(password);
  
  // Actualizar visualización de requisitos
  actualizarRequisitoPerfil('req-length-perfil', reqLength);
  actualizarRequisitoPerfil('req-uppercase-perfil', reqUppercase);
  actualizarRequisitoPerfil('req-lowercase-perfil', reqLowercase);
  actualizarRequisitoPerfil('req-number-perfil', reqNumber);
  
  // Calcular fuerza de la contraseña
  const cumplidos = [reqLength, reqUppercase, reqLowercase, reqNumber].filter(Boolean).length;
  const strengthBar = document.getElementById('strengthBarPerfil');
  const strengthText = document.getElementById('strengthTextPerfil');
  
  strengthBar.className = 'password-strength-bar';
  
  if (cumplidos === 0) {
    strengthBar.classList.remove('strength-weak', 'strength-medium', 'strength-strong');
    strengthText.textContent = '';
  } else if (cumplidos <= 2) {
    strengthBar.classList.add('strength-weak');
    strengthText.textContent = 'Contraseña débil';
    strengthText.style.color = '#dc3545';
  } else if (cumplidos === 3) {
    strengthBar.classList.add('strength-medium');
    strengthText.textContent = 'Contraseña media';
    strengthText.style.color = '#ffc107';
  } else {
    strengthBar.classList.add('strength-strong');
    strengthText.textContent = 'Contraseña fuerte';
    strengthText.style.color = '#28a745';
  }
  
  // Verificar coincidencia si ya escribió en confirmar
  verificarCoincidenciaPerfil();
}

// Actualizar estado visual de cada requisito (PERFIL)
function actualizarRequisitoPerfil(id, cumple) {
  const elemento = document.getElementById(id);
  if (!elemento) return;
  
  const icono = elemento.querySelector('.requirement-icon');
  
  if (cumple) {
    elemento.classList.add('valid');
    elemento.classList.remove('invalid');
    icono.textContent = '✓';
  } else {
    elemento.classList.remove('valid');
    elemento.classList.add('invalid');
    icono.textContent = '✗';
  }
}

// Verificar que las contraseñas coincidan (PERFIL)
function verificarCoincidenciaPerfil() {
  const password = document.getElementById('contraseña');
  const confirmPassword = document.getElementById('contraseña_confirmar');
  const matchMessage = document.getElementById('matchMessagePerfil');
  
  if (!password || !confirmPassword || !matchMessage) return;
  
  if (confirmPassword.value === '') {
    matchMessage.textContent = '';
    return;
  }
  
  if (password.value === confirmPassword.value) {
    matchMessage.textContent = '✓ Las contraseñas coinciden';
    matchMessage.style.color = '#28a745';
  } else {
    matchMessage.textContent = '✗ Las contraseñas no coinciden';
    matchMessage.style.color = '#dc3545';
  }
}

// Validar formulario de perfil antes de enviar
function validarFormularioPerfil(event) {
  const password = document.getElementById('contraseña').value;
  const confirmPassword = document.getElementById('contraseña_confirmar').value;
  const usuario = document.getElementById('usuario').value.trim();
  const errorContainer = document.getElementById('errorContainerPerfil');
  
  let errores = [];
  
  // Validar usuario solo si no está vacío
  if (usuario !== '' && usuario.length < 3) {
    errores.push('El nombre de usuario debe tener al menos 3 caracteres');
  }
  
  // Validar contraseña solo si no está vacía
  if (password !== '') {
    if (password.length < 8) {
      errores.push('La contraseña debe tener al menos 8 caracteres');
    }
    
    if (!/[A-Z]/.test(password)) {
      errores.push('La contraseña debe contener al menos una letra mayúscula');
    }
    
    if (!/[a-z]/.test(password)) {
      errores.push('La contraseña debe contener al menos una letra minúscula');
    }
    
    if (!/[0-9]/.test(password)) {
      errores.push('La contraseña debe contener al menos un número');
    }
    
    // Validar coincidencia solo si se ingresó contraseña
    if (password !== confirmPassword) {
      errores.push('Las contraseñas no coinciden');
    }
  }
  
  // Verificar que al menos un campo tenga contenido
  if (usuario === '' && password === '') {
    errores.push('Debes ingresar al menos un campo para actualizar');
  }
  
  // Mostrar errores o enviar formulario
  if (errores.length > 0) {
    event.preventDefault();
    errorContainer.innerHTML = '<strong>Errores:</strong><ul style="margin: 10px 0 0 20px;">' + 
      errores.map(e => '<li>' + e + '</li>').join('') + '</ul>';
    errorContainer.style.display = 'block';
    
    // Scroll al error
    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    return false;
  }
  
  errorContainer.style.display = 'none';
  return true;
}