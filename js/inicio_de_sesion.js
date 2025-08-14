document.addEventListener("DOMContentLoaded", function () {
    // Obtener el formulario
    const form = document.querySelector("form");
    const usuario = document.getElementById("usuario");
    const password = document.getElementById("password");
    // Escuchar el evento submit
    form.addEventListener("submit", function (event) {
        let errores = [];
        // Validar usuario o correo
        if (usuario.value.trim() === "") {
            errores.push("Por favor, ingresa tu usuario o correo.");
        }
        // Validar contraseña
        if (password.value.trim() === "") {
            errores.push("Por favor, ingresa tu contraseña.");
        }
        // Si hay errores, evitar el envío y mostrarlos
        if (errores.length > 0) {
            event.preventDefault();    
            alert(errores.join("\n")); 
        }
    });
});