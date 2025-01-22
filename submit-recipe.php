<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "webdev";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'POST') {
    $recipeName = $_POST['recipeName'] ?? null;
    $ingredients = $_POST['ingredients'] ?? null;
    $measurements = $_POST['measurements'] ?? null;
    $instructions = $_POST['instructions'] ?? null;
    $creator = $_POST['creator'] ?? null;

    if (!$recipeName || !$ingredients || !$measurements || !$instructions || !$creator) {
        die(json_encode(["success" => false, "message" => "Missing required fields"]));
    }

    $destPath = '';
    if (isset($_FILES['dishImage']) && $_FILES['dishImage']['error'] == 0) {
        $fileTmpPath = $_FILES['dishImage']['tmp_name'];
        $fileName = basename($_FILES['dishImage']['name']);
        $uploadDir = 'uploads/';
        $destPath = $uploadDir . $fileName;

        if (!move_uploaded_file($fileTmpPath, $destPath)) {
            die(json_encode(["success" => false, "message" => "Failed to upload image."]));
        }
    }

    $stmt = $conn->prepare("INSERT INTO recipes (recipe_name, ingredients, measurements, instructions, dish_image, creator) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $recipeName, $ingredients, $measurements, $instructions, $destPath, $creator);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Recipe added successfully!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error: " . $stmt->error]);
    }

    $stmt->close();
}

$conn->close();
?>
