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

$cuisine = isset($_GET['cuisine']) ? $_GET['cuisine'] : '';
$search = isset($_GET['search']) ? $_GET['search'] : '';

$sql = "SELECT id, name, cuisine, rating, delivery_time, image_url, price_range, location, is_open 
        FROM restaurants WHERE 1=1";

if ($cuisine && $cuisine != 'All') {
    $sql .= " AND cuisine = '$cuisine'";
}

if ($search) {
    $sql .= " AND name LIKE '%$search%'";
}

$sql .= " ORDER BY rating DESC";

$result = $conn->query($sql);
$restaurants = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $restaurants[] = $row;
    }
}

echo json_encode($restaurants);
$conn->close();
?>