<?php
session_start();
require_once "conexion.php";
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $usuario = trim($_POST['usuario']);
    $password = trim($_POST['password']);
    if (empty($usuario) || empty($password)) {
        die("Por favor, completa todos los campos.");
    }
    $sql = "SELECT id, usuario, correo, contrasena FROM usuarios
            WHERE usuario = ? OR correo = ? LIMIT 1";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("ss", $usuario, $usuario);
    $stmt->execute();
    $resultado = $stmt->get_result();
    if ($resultado->num_rows === 1) {
        $fila = $resultado->fetch_assoc();
        if (password_verify($password, $fila['contrasena'])) {
            $_SESSION['usuario_id'] = $fila['id'];
            $_SESSION['usuario_nombre'] = $fila['usuario'];
            header("Location: ../html/administrador_de_tareas.html");
            exit();
        } else {
            echo "Contraseña incorrecta.";
        }
    } else {
        echo "Usuario o correo no encontrado.";
    }
    $stmt->close();
    $conexion->close();
} else {
    echo "Método no permitido.";
}
?>