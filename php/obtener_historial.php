<?php
header('Content-Type: application/json; charset=utf-8');
require __DIR__ . '/conexion.php';
// Ejecutar consulta incluyendo estado
$sql = "SELECT usuario, accion, estado, fecha 
        FROM historial_acciones 
        ORDER BY fecha DESC";
$res = $conexion->query($sql);
if (!$res) {
    http_response_code(500);
    echo json_encode([
        "status"  => "error",
        "mensaje" => $conexion->error
    ]);
    exit;
}
$historial = [];
while ($row = $res->fetch_assoc()) {
    $historial[] = $row;
}
// Forzar salida JSON con array vacío si no hay datos
echo json_encode($historial, JSON_UNESCAPED_UNICODE);