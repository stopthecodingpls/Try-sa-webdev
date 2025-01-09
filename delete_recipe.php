<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "webdev";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

if (isset($_GET['id'])) {
    $recipe_id = $_GET['id'];

    $deleteQuery = "DELETE FROM recipes WHERE id = ?";
    $stmt = $conn->prepare($deleteQuery);
    $stmt->bind_param("i", $recipe_id);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Recipe deleted successfully"]);
    } else {
        echo json_encode(["error" => "Failed to delete recipe"]);
    }

    $stmt->close();
} else {
    echo json_encode(["error" => "Recipe ID not provided"]);
}

$conn->close();
?>
