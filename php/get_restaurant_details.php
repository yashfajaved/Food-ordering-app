<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

error_reporting(0);
ini_set('display_errors', 0);

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "leohub_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit();
}

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id <= 0) {
    echo json_encode(["error" => "Invalid ID"]);
    exit();
}

$sql = "SELECT id, name, cuisine, rating, delivery_time, image_url, price_range, location, is_open 
        FROM restaurants WHERE id = $id";

$result = $conn->query($sql);
$restaurant = null;

if ($result->num_rows > 0) {
    $restaurant = $result->fetch_assoc();
}

echo json_encode($restaurant);
$conn->close();
?>