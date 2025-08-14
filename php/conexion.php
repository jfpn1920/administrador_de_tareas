<?php
$servidor="localhost";
$usuario="root";
$clave="";
$bd="administrador_de_tareas";
$conexion = new mysqli($servidor, $usuario, $clave, $bd);
if ($conexion->connect_error) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(["status"=>"error","mensaje"=>"Error de conexión: ".$conexion->connect_error]);
    exit;
}
$conexion->set_charset("utf8");