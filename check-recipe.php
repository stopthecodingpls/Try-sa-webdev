<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "webdev";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

$creator = $_GET['creator'];
$recipeName = $_GET['recipeName'];

if (empty($creator) || empty($recipeName)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid parameters"]);
    exit;
}

$sql = "SELECT id FROM recipes WHERE creator = ? AND recipe_name = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $creator, $recipeName);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(["exists" => true]);
} else {
    echo json_encode(["exists" => false]);
}

$stmt->close();
$conn->close();
?>
