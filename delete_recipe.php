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

    // Start a transaction to ensure both operations are atomic
    $conn->begin_transaction();

    try {
        // Delete feedback and ratings associated with the recipe
        $deleteReviewsQuery = "DELETE FROM review WHERE recipe_id = ?";
        $stmtReviews = $conn->prepare($deleteReviewsQuery);
        $stmtReviews->bind_param("i", $recipe_id);
        if (!$stmtReviews->execute()) {
            throw new Exception("Failed to delete reviews");
        }

        // Delete the recipe itself
        $deleteRecipeQuery = "DELETE FROM recipes WHERE id = ?";
        $stmtRecipe = $conn->prepare($deleteRecipeQuery);
        $stmtRecipe->bind_param("i", $recipe_id);
        if (!$stmtRecipe->execute()) {
            throw new Exception("Failed to delete recipe");
        }

        // Commit the transaction
        $conn->commit();

        echo json_encode(["message" => "Recipe and associated reviews deleted successfully"]);

        $stmtReviews->close();
        $stmtRecipe->close();
    } catch (Exception $e) {
        // Rollback the transaction if any query fails
        $conn->rollback();
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Recipe ID not provided"]);
}

$conn->close();
?>
