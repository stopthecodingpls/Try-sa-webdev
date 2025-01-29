<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "webdev";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);

if ($data === null) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid JSON received",
        "rawInput" => $rawInput,
        "error" => json_last_error_msg()
    ]);
    exit;
}

$Recipe_id = $data['Recipe_id'] ?? null;
$Feedback = $data['Feedback'] ?? null;
$Rating = $data['Rating'] ?? null;
$user_email = $data['user_email'] ?? null;

if (empty($Recipe_id) || empty($Feedback) || empty($Rating) || empty($user_email)) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid input: Recipe_id, Feedback, and Rating are required",
        "receivedData" => $data
    ]);
    exit;
}

$checkCreatorQuery = "SELECT creator FROM recipes WHERE id = ?";
$stmt = $conn->prepare($checkCreatorQuery);
$stmt->bind_param("i", $Recipe_id);
$stmt->execute();
$stmt->bind_result($creator);
$stmt->fetch();
$stmt->close();

if ($creator === $user_email) {
    echo json_encode(["success" => false, "message" => "You cannot review your own recipe."]);
    exit;
}

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

$stmt->close();
$conn->close();
?>
