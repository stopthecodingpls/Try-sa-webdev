<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "webdev";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Get data from the request
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email'])) {
    die(json_encode(["error" => "Email not provided."]));
}

$email = $data['email'];

// Fetch user details
$userQuery = "SELECT firstname, lastname, email, role FROM users WHERE email = ?";
$stmt = $conn->prepare($userQuery);
$stmt->bind_param("s", $email);
$stmt->execute();
$userResult = $stmt->get_result();
$user = $userResult->fetch_assoc();

// Fetch recipes where creator matches email
$recipeQuery = "SELECT id, recipe_name FROM recipes WHERE creator = ?";
$stmt = $conn->prepare($recipeQuery);
$stmt->bind_param("s", $email);
$stmt->execute();
$recipeResult = $stmt->get_result();
$recipes = [];
while ($row = $recipeResult->fetch_assoc()) {
    $recipes[] = $row;
}

// Fetch feedbacks for user's recipes
$feedbackQuery = "SELECT Feedback AS text, Ratings AS rating, Recipe_id, Creator FROM review WHERE Recipe_id IN (SELECT id FROM recipes WHERE creator = ?)";
$stmt = $conn->prepare($feedbackQuery);
$stmt->bind_param("s", $email);
$stmt->execute();
$feedbackResult = $stmt->get_result();
$feedbacks = [];
while ($row = $feedbackResult->fetch_assoc()) {
    $feedbacks[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode([
    "user" => $user,
    "recipes" => $recipes,
    "feedbacks" => $feedbacks
]);
?>
