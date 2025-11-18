//AJAX para los chats
function buscarUsuarios() {
    const termino = document.getElementById('terminoBusqueda').value;
    const formData = new FormData();
    formData.append('termino', termino);

    fetch('./procesos/buscar_usuario.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            mostrarResultados(data.resultados);
        } else {
            alert(data.error || 'Error en la búsqueda');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al realizar la búsqueda');
    });
}

function mostrarResultados(resultados) {
    const contenedor = document.getElementById('resultadosBusqueda');
    const lista = document.getElementById('listaResultados');
    
    if(resultados.length > 0) {
        let html = '<ul>';
        resultados.forEach(usuario => {
            html += `<li>
                ${usuario.usuario} 
                <small>(Se unio: ${usuario.fecha_creacion})</small>
                <button onclick="agregarContacto(${usuario.id_usuario})">Agregar</button>
            </li>`;
        });
        html += '</ul>';
        lista.innerHTML = html;
        contenedor.style.display = 'block';
    } else {
        lista.innerHTML = '<p>No se encontraron usuarios que coincidan con la búsqueda.</p>';
        contenedor.style.display = 'block';
    }
}

// Función opcional para agregar contacto
function agregarContacto(id_usuario) {
    // Implementa aquí la lógica para agregar el contacto
    console.log('Agregar contacto:', id_usuario);
}

//ocultar o mostrar contraseña
function togglePassword() {
    const pw = document.getElementById("contrasena");
    const btn = document.querySelector(".toggle-pw");
if (pw.type === "password") {
    pw.type = "text";
    btn.textContent = "Ocultar";
    } else {
        pw.type = "password";
        btn.textContent = "Mostrar";
    }
}