<?php
header('Content-Type: application/json; charset=utf-8');
// Incluimos con ruta absoluta para evitar problemas
require __DIR__ . '/conexion.php';
// Solo aceptamos POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "status" => "error",
        "mensaje" => "Método no permitido"
    ]);
    exit;
}
// Sanitizar entrada
$usuario = trim($_POST['usuario'] ?? '');
$accion  = trim($_POST['accion'] ?? '');
$estado  = trim($_POST['estado'] ?? '');
// Validar que todos los campos estén presentes
if ($usuario === '' || $accion === '' || $estado === '') {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "mensaje" => "Datos incompletos"
    ]);
    exit;
}
// Preparar consulta con estado
$stmt = $conexion->prepare(
    "INSERT INTO historial_acciones (usuario, accion, estado) VALUES (?, ?, ?)"
);
if (!$stmt) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "mensaje" => $conexion->error
    ]);
    exit;
}
$stmt->bind_param("sss", $usuario, $accion, $estado);
$ok = $stmt->execute();
$stmt->close();
if ($ok) {
    echo json_encode(["status" => "ok"]);
} else {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "mensaje" => "No se pudo guardar en la base de datos"
    ]);
}