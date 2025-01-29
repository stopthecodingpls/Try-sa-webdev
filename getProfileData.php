<?php
session_start(); // Start session to access locally stored email

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

// Get email from session or request
$email = $_SESSION['email'] ?? json_decode(file_get_contents("php://input"), true)['email'] ?? null;

if (!$email) {
    die(json_encode(["error" => "Email not provided."]));
}

// Fetch user details based on email
$userQuery = "SELECT firstname, lastname, email FROM users WHERE email = ?";
$stmt = $conn->prepare($userQuery);
$stmt->bind_param("s", $email);
$stmt->execute();
$userResult = $stmt->get_result();
$user = $userResult->fetch_assoc();

if (!$user) {
    die(json_encode(["error" => "User not found."]));
}

$email = $user['email']; // Use firstname from the database

// Fetch recipes where creator matches firstname
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
$feedbackQuery = "SELECT Feedback AS text, Ratings AS rating, Recipe_id FROM review WHERE Recipe_id IN (SELECT id FROM recipes WHERE creator = ?)";
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
