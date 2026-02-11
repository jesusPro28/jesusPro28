<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");


if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}


include 'db_connect.php'; 


$sql = "SELECT titulo, contenido, fecha, imagen, tipo_imagen FROM publicaciones ORDER BY created_at DESC";
$result = $conn->query($sql);

$noticias = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        
        if ($row['imagen']) {
            $row['imagen'] = 'data:' . $row['tipo_imagen'] . ';base64,' . base64_encode($row['imagen']);
        }
        $noticias[] = $row;
    }
}

echo json_encode($noticias);
$conn->close();
?>