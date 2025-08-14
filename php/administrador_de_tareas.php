<?php
header('Content-Type: application/json');
$response = [];
require_once 'conexion.php';
// Verificar conexión
if (!$conexion) {
    echo json_encode(["success" => false, "message" => "Error de conexión a la base de datos"]);
    exit;
}
// Recibir datos desde JS (AJAX)
$accion      = $_POST['accion'] ?? '';
$titulo      = $_POST['titulo'] ?? '';
$descripcion = $_POST['descripcion'] ?? '';
$asignadoA   = $_POST['asignadoA'] ?? '';
$estado      = $_POST['estado'] ?? '';
$usuario     = $_POST['usuario'] ?? 'Desconocido';
$tareaId     = isset($_POST['idTarea']) ? intval($_POST['idTarea']) : null;
function guardarHistorial($conexion, $tareaId, $usuario, $accionTipo) {
    $stmt = $conexion->prepare("INSERT INTO historial_acciones (tarea_id, usuario, accion) VALUES (?, ?, ?)");
    if ($stmt) {
        $stmt->bind_param("iss", $tareaId, $usuario, $accionTipo);
        $stmt->execute();
        $stmt->close();
    }
}
if (!in_array($accion, ["crear", "editar", "completar"]) && $tareaId && $accion) {
    $stmt = $conexion->prepare("INSERT INTO historial_acciones (tarea_id, accion, usuario) VALUES (?, ?, ?)");
    if ($stmt) {
        $stmt->bind_param("iss", $tareaId, $accion, $usuario);
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Historial guardado correctamente"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error al guardar historial: " . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Error en la preparación de la consulta: " . $conexion->error]);
    }
    exit;
}
if ($accion === "crear") {
    $stmt = $conexion->prepare("INSERT INTO tareas (titulo, descripcion, asignado_a, estado) VALUES (?, ?, ?, ?)");
    if ($stmt) {
        $stmt->bind_param("ssss", $titulo, $descripcion, $asignadoA, $estado);
        if ($stmt->execute()) {
            $tareaId = $stmt->insert_id;
            guardarHistorial($conexion, $tareaId, $usuario, 'creacion');
            $response = ["success" => true, "message" => "Tarea creada y registrada en historial"];
        } else {
            $response = ["success" => false, "message" => "Error al crear la tarea"];
        }
        $stmt->close();
    }
}
if ($accion === "editar" && $tareaId) {
    $stmt = $conexion->prepare("UPDATE tareas SET titulo=?, descripcion=?, asignado_a=?, estado=? WHERE id=?");
    if ($stmt) {
        $stmt->bind_param("ssssi", $titulo, $descripcion, $asignadoA, $estado, $tareaId);
        if ($stmt->execute()) {
            guardarHistorial($conexion, $tareaId, $usuario, 'edicion');
            $response = ["success" => true, "message" => "Tarea editada y registrada en historial"];
        } else {
            $response = ["success" => false, "message" => "Error al editar la tarea"];
        }
        $stmt->close();
    }
}
if ($accion === "completar" && $tareaId) {
    $stmt = $conexion->prepare("UPDATE tareas SET estado='completada' WHERE id=?");
    if ($stmt) {
        $stmt->bind_param("i", $tareaId);
        if ($stmt->execute()) {
            guardarHistorial($conexion, $tareaId, $usuario, 'completada');
            $response = ["success" => true, "message" => "Tarea completada y registrada en historial"];
        } else {
            $response = ["success" => false, "message" => "Error al completar la tarea"];
        }
        $stmt->close();
    }
}
echo json_encode($response);
exit;
?>
