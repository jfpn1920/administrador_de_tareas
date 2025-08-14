<?php
session_start();
require_once "conexion.php";
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $usuario   = trim($_POST['usuario']);
    $correo    = trim($_POST['correo']);
    $password  = trim($_POST['password']);
    $confirmar = trim($_POST['confirmar']);
    if (empty($usuario) || empty($correo) || empty($password) || empty($confirmar)) {
        die("Por favor, completa todos los campos.");
    }
    if ($password !== $confirmar) {
        die("Las contraseñas no coinciden.");
    }
    $sql_check = "SELECT id FROM usuarios WHERE usuario = ? OR correo = ? LIMIT 1";
    $stmt_check = $conexion->prepare($sql_check);
    $stmt_check->bind_param("ss", $usuario, $correo);
    $stmt_check->execute();
    $resultado = $stmt_check->get_result();
    if ($resultado->num_rows > 0) {
        die("El usuario o el correo ya están registrados.");
    }
    $stmt_check->close();
    $contrasena_segura = password_hash($password, PASSWORD_DEFAULT);
    $sql_insert = "INSERT INTO usuarios (usuario, correo, contrasena) VALUES (?, ?, ?)";
    $stmt_insert = $conexion->prepare($sql_insert);
    $stmt_insert->bind_param("sss", $usuario, $correo, $contrasena_segura);
    if ($stmt_insert->execute()) {
        header("Location: ../html/inicio_de_sesion.html");
        exit();
    } else {
        echo "Error al registrar el usuario: " . $conexion->error;
    }
    $stmt_insert->close();
    $conexion->close();
} else {
    echo "Método no permitido.";
}
?>