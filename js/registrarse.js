document.addEventListener("DOMContentLoaded", function () {
    // Obtener elementos
    const form = document.querySelector("form");
    const usuario = document.getElementById("usuario");
    const correo = document.getElementById("correo");
    const password = document.getElementById("password");
    const confirmar = document.getElementById("confirmar");
    form.addEventListener("submit", function (event) {
        let errores = [];
        // Validar usuario
        if (usuario.value.trim() === "") {
            errores.push("Por favor, ingresa un usuario.");
        }
        // Validar correo
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexCorreo.test(correo.value.trim())) {
            errores.push("Por favor, ingresa un correo válido.");
        }
        // Validar contraseña
        if (password.value.trim() === "") {
            errores.push("Por favor, ingresa una contraseña.");
        }
        // Validar confirmación de contraseña
        if (confirmar.value.trim() === "") {
            errores.push("Por favor, confirma tu contraseña.");
        }
        // Verificar que las contraseñas coincidan
        if (password.value.trim() !== confirmar.value.trim()) {
            errores.push("Las contraseñas no coinciden.");
        }
        // Mostrar errores y evitar envío
        if (errores.length > 0) {
            event.preventDefault();
            alert(errores.join("\n"));
        }
    });
});