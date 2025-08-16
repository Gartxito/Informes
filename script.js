
function getUsuarioActual() {
    return JSON.parse(localStorage.getItem('usuarioActual'));
}

function cerrarSesion() {
    localStorage.removeItem('usuarioActual');
    window.location.href = 'login.html';
}

function mostrarNombreUsuario() {
    const usuario = getUsuarioActual();
    if (!usuario) {
        window.location.href = 'login.html';
        return;
    }
    document.getElementById('nombreUsuario').textContent = usuario.nombre;
}

function generarRecomendaciones(descripcion) {
    const texto = descripcion.toLowerCase();
    let recomendados = [];
    let evitar = [];

    if (texto.includes("rodilla")) {
        recomendados = ["Natación", "Bicicleta estática suave", "Ejercicios de estiramiento"];
        evitar = ["Sentadillas", "Correr", "Saltar"];
    } else if (texto.includes("espalda")) {
        recomendados = ["Pilates", "Yoga suave", "Caminatas suaves"];
        evitar = ["Levantamiento de pesas", "Ejercicios de impacto", "Torsiones bruscas"];
    } else {
        recomendados = ["Caminar", "Ejercicios respiratorios"];
        evitar = ["Ejercicios intensos sin supervisión"];
    }

    let html = "<p><strong>Ejercicios recomendados:</strong></p><ul>";
    recomendados.forEach(ej => html += `<li>✅ ${ej}</li>`);
    html += "</ul><p><strong>Ejercicios a evitar:</strong></p><ul>";
    evitar.forEach(ej => html += `<li>❌ ${ej}</li>`);
    html += "</ul>";

    document.getElementById('recomendaciones').innerHTML = html;
}

function guardarInforme(usuarioEmail, archivo, descripcion) {
    const informes = JSON.parse(localStorage.getItem('informes')) || {};
    if (!informes[usuarioEmail]) {
        informes[usuarioEmail] = [];
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        informes[usuarioEmail].push({
            nombreArchivo: archivo.name,
            fecha: new Date().toLocaleString(),
            contenido: e.target.result,
            descripcion: descripcion
        });
        localStorage.setItem('informes', JSON.stringify(informes));
        mostrarInformes(usuarioEmail);
        generarRecomendaciones(descripcion);
        document.getElementById('mensaje').innerText = "Informe y descripción enviados correctamente.";
    };
    reader.readAsDataURL(archivo);
}

function mostrarInformes(usuarioEmail) {
    const informes = JSON.parse(localStorage.getItem('informes')) || {};
    const lista = document.getElementById('listaInformes');
    lista.innerHTML = '';
    (informes[usuarioEmail] || []).forEach(info => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = info.contenido;
        link.textContent = `${info.nombreArchivo} (subido el ${info.fecha})`;
        link.target = "_blank";
        li.appendChild(link);
        lista.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    mostrarNombreUsuario();
    const usuario = getUsuarioActual();
    mostrarInformes(usuario.email);

    document.getElementById('uploadForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const archivo = document.getElementById('informe').files[0];
        const descripcion = document.getElementById('descripcion').value;

        if (archivo && archivo.type === 'application/pdf') {
            guardarInforme(usuario.email, archivo, descripcion);
        } else {
            document.getElementById('mensaje').innerText = "Por favor, sube un archivo PDF válido.";
        }
    });
});

function mostrarRespuesta(usuarioEmail) {
    const respuestas = JSON.parse(localStorage.getItem('respuestas')) || {};
    const div = document.getElementById('respuestaPDF');
    div.innerHTML = '';

    if (respuestas[usuarioEmail]) {
        const link = document.createElement('a');
        link.href = respuestas[usuarioEmail].contenido;
        link.textContent = `📄 ${respuestas[usuarioEmail].nombreArchivo} (subido el ${respuestas[usuarioEmail].fecha})`;
        link.target = "_blank";
        div.appendChild(link);
    } else {
        div.innerText = "Todavía no hay recomendación subida por el profesor.";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const usuario = getUsuarioActual();
    mostrarRespuesta(usuario.email);
});
