<?php
$servidor="localhost";    
$usuario="root";         
$clave="";             
$bd="administrador_de_tareas";
$conexion = new mysqli($servidor, $usuario, $clave, $bd);
if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}
$conexion->set_charset("utf8");
?>