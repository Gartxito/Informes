
// Simulador de base de datos local con localStorage

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

            if (usuarios.some(u => u.email === email)) {
                mostrarMensaje('Ya existe una cuenta con este correo.');
                return;
            }

            usuarios.push({ nombre, email, password });
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            mostrarMensaje('Registro exitoso. Ahora puedes iniciar sesión.');
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            let usuario = usuarios.find(u => u.email === email && u.password === password);

            if (usuario) {
                localStorage.setItem('usuarioActual', JSON.stringify(usuario));
                window.location.href = 'index.html';
            } else {
                mostrarMensaje('Correo o contraseña incorrectos.');
            }
        });
    }

    function mostrarMensaje(mensaje) {
        const div = document.getElementById('mensaje');
        div.innerText = mensaje;
    }
});
