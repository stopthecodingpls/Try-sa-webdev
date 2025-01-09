<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Database connection details
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "webdev";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check database connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Debugging: Check the raw input
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true); // Decode JSON data into an associative array

// Debugging output for validation
if ($data === null) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid JSON received",
        "rawInput" => $rawInput,
        "error" => json_last_error_msg()
    ]);
    exit;
}

// Extract variables from JSON data
$Recipe_id = $data['Recipe_id'] ?? null;
$Feedback = $data['Feedback'] ?? null;
$Rating = $data['Rating'] ?? null;

// Validate input data
if (empty($Recipe_id) || empty($Feedback) || empty($Rating)) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid input: Recipe_id, Feedback, and Rating are required",
        "receivedData" => $data
    ]);
    exit;
}

// Insert data into the database
$stmt = $conn->prepare("INSERT INTO review (Recipe_id, Feedback, Ratings) VALUES (?, ?, ?)");
if (!$stmt) {
    echo json_encode([
        "success" => false,
        "message" => "Failed to prepare statement",
        "error" => $conn->error
    ]);
    exit;
}

$stmt->bind_param("isi", $Recipe_id, $Feedback, $Rating);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Feedback saved successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to insert feedback", "error" => $stmt->error]);
}

// Close the statement and connection
$stmt->close();
$conn->close();
?>
