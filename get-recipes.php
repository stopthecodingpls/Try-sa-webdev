<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "webdev";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

// Fetch recipes along with their reviews
$query = "
    SELECT 
        r.id AS recipe_id, 
        r.recipe_name, 
        r.ingredients, 
        r.measurements, 
        r.instructions, 
        r.dish_image,
        r.creator,
        rv.Ratings,
        rv.Feedback
    FROM 
        recipes r
    LEFT JOIN 
        review rv
    ON 
        r.id = rv.Recipe_id
";

$result = $conn->query($query);

if ($result->num_rows > 0) {
    $recipes = [];
    
    // Group reviews by recipe
    while ($row = $result->fetch_assoc()) {
        $recipeId = $row['recipe_id'];
        
        if (!isset($recipes[$recipeId])) {
            $recipes[$recipeId] = [
                "id" => $row["recipe_id"],
                "recipe_name" => $row["recipe_name"],
                "ingredients" => $row["ingredients"],
                "measurements" => $row["measurements"],
                "instructions" => $row["instructions"],
                "dish_image" => $row["dish_image"],
                "creator" => $row["creator"],
                "feedback" => []
            ];
        }

        // Append review only if it's not null
        if (!empty($row["Ratings"]) || !empty($row["Feedback"])) {
            $recipes[$recipeId]["feedback"][] = [
                "rating" => $row["Ratings"],
                "feedback" => $row["Feedback"]
            ];
        }
    }

    // Reindex to return a proper array
    echo json_encode(array_values($recipes));
} else {
    echo json_encode([]);
}

$conn->close();
?>
