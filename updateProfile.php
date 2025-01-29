<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "webdev";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->firstname) || !isset($data->lastname) || !isset($data->role) || !isset($data->email)) {
    echo json_encode(["error" => "Invalid input"]);
    exit;
}

$firstname = $conn->real_escape_string($data->firstname);
$lastname = $conn->real_escape_string($data->lastname);
$role = $conn->real_escape_string($data->role);
$email = $conn->real_escape_string($data->email);

$sql = "UPDATE users SET firstname = ?, lastname = ?, role = ? WHERE email = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $firstname, $lastname, $role, $email);

if ($stmt->execute()) {
    echo json_encode(["success" => "Profile updated successfully"]);
} else {
    echo json_encode(["error" => "Failed to update profile"]);
}

$stmt->close();
$conn->close();
?>
