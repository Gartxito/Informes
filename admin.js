
function cerrarSesion() {
    localStorage.removeItem('profesor');
    window.location.href = 'admin_login.html';
}

function mostrarPanel() {
    const profesor = localStorage.getItem('profesor');
    if (profesor !== 'profesor123') {
        window.location.href = 'admin_login.html';
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const informes = JSON.parse(localStorage.getItem('informes')) || {};
    const respuestas = JSON.parse(localStorage.getItem('respuestas')) || {};

    const contenedor = document.getElementById('contenido');
    contenedor.innerHTML = '';

    usuarios.forEach(usuario => {
        const div = document.createElement('div');
        div.style.border = "1px solid #ccc";
        div.style.padding = "10px";
        div.style.marginTop = "20px";

        div.innerHTML = `<h3>${usuario.nombre} (${usuario.email})</h3>`;

        const lista = document.createElement('ul');
        (informes[usuario.email] || []).forEach((informe, idx) => {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = informe.contenido;
            link.target = "_blank";
            link.textContent = `${informe.nombreArchivo} (subido el ${informe.fecha})`;
            li.appendChild(link);
            lista.appendChild(li);
        });

        div.appendChild(lista);

        const form = document.createElement('form');
        form.innerHTML = `
            <label for="respuesta-${usuario.email}">Subir recomendación en PDF:</label>
            <input type="file" accept="application/pdf" id="respuesta-${usuario.email}" required>
            <button type="submit">Subir</button>
        `;

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const archivo = document.getElementById(`respuesta-${usuario.email}`).files[0];
            const reader = new FileReader();
            reader.onload = function(ev) {
                respuestas[usuario.email] = {
                    nombreArchivo: archivo.name,
                    contenido: ev.target.result,
                    fecha: new Date().toLocaleString()
                };
                localStorage.setItem('respuestas', JSON.stringify(respuestas));
                alert("Recomendación subida correctamente.");
            };
            reader.readAsDataURL(archivo);
        });

        div.appendChild(form);
        contenedor.appendChild(div);
    });
}

document.addEventListener('DOMContentLoaded', mostrarPanel);
