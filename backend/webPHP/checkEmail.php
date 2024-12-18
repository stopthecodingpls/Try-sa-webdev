<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "webdev";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the JSON input
    $data = json_decode(file_get_contents("php://input"), true);
    $email = $data['email'];

    // Prepare and bind
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);

    // Execute the statement
    $stmt->execute();

    // Store the result
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        echo json_encode(["success" => false]);
    } else {
        echo json_encode(["success" => true]);
    }

    // Close the statement and connection
    $stmt->close();
}

$conn->close();
?>

