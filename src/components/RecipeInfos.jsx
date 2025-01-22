import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Css/RecipeInfos.css";
import Footer from "./Footer";
import Navbar from "./Navbar";

const RecipeInfos = () => {
    const [recipeName, setRecipeName] = useState("");
    const [dishImage, setDishImage] = useState(null);
    const [ingredients, setIngredients] = useState("");
    const [measurements, setMeasurements] = useState("");
    const [instructions, setInstructions] = useState("");
    const [creator, setCreator] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const storedFirstName = localStorage.getItem("firstname");

        if (storedFirstName) {
        setCreator(storedFirstName);
        } else {
        setCreator("Anonymous User");
        }
    }, []);

    const handleImageUpload = (e) => {
        setDishImage(e.target.files[0]);
    };

    const notifysuccess = () =>
        toast.success("Recipe submitted successfully!", {
        className: "bg-green-500 text-white font-semibold p-3 rounded-lg shadow-lg",
        });

    const notifyfail = () =>
        toast.error("Oh No! Something went wrong", {
        className: "bg-red-500 text-white font-semibold p-3 rounded-lg shadow-lg",
        });

    useEffect(() => {
        const handleBeforeUnload = (e) => {
        if (recipeName || ingredients || measurements || instructions) {
            e.preventDefault();
            e.returnValue = "";
        }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [recipeName, ingredients, measurements, instructions]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isEmptyOrSpaces = (str) => !str || str.trim().length === 0;

        if (isEmptyOrSpaces(recipeName)) {
        toast.error("Recipe Name cannot be empty or spaces only!", {
            className: "bg-red-500 text-white font-semibold p-3 rounded-lg shadow-lg",
        });
        return;
        }
        if (isEmptyOrSpaces(ingredients)) {
        toast.error("Ingredients cannot be empty or spaces only!", {
            className: "bg-red-500 text-white font-semibold p-3 rounded-lg shadow-lg",
        });
        return;
        }
        if (isEmptyOrSpaces(measurements)) {
        toast.error("Measurements cannot be empty or spaces only!", {
            className: "bg-red-500 text-white font-semibold p-3 rounded-lg shadow-lg",
        });
        return;
        }
        if (isEmptyOrSpaces(instructions)) {
        toast.error("Instructions cannot be empty or spaces only!", {
            className: "bg-red-500 text-white font-semibold p-3 rounded-lg shadow-lg",
        });
        return;
        }

        const formData = new FormData();
        formData.append("recipeName", recipeName);
        formData.append("dishImage", dishImage);
        formData.append("ingredients", ingredients);
        formData.append("measurements", measurements);
        formData.append("instructions", instructions);
        formData.append("creator", creator);

        try {
        const response = await fetch("http://localhost/webPHP/submit-recipe.php", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            notifysuccess();
            navigate("/AddRecipes");
        } else {
            notifyfail();
        }
        } catch (error) {
        notifyfail();
        }
    };

    return (
        <div>
        <Navbar />
        <div className="recipe-info-container">
            <form onSubmit={handleSubmit} className="recipe-form">
                
            {/* Recipe Name */}
            <div className="form-group">
                <h1 className="font-logo text-4xl">Recipe Information</h1>
                <p>Here you can add detailed information about your recipe.</p>
                <div className="border-b border-black my-4"></div>
                <label htmlFor="recipeName">Recipe Name:</label>
                <input
                type="text"
                name="recipeName"
                id="recipeName"
                placeholder="Enter the name of your recipe"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                required
                />
            </div>

            {/* Dish Image */}
            <div className="form-group">
                <label htmlFor="dishImage">Dish Image:</label>
                <input
                type="file"
                name="dishImage"
                id="dishImage"
                accept="image/*"
                onChange={handleImageUpload}
                />
            </div>

            {/* Ingredients */}
            <div className="form-group">
                <label htmlFor="ingredients">Ingredients:</label>
                <textarea
                name="ingredients"
                id="ingredients"
                placeholder="Enter the ingredients for the recipe"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                required
                ></textarea>
            </div>

            {/* Measurements */}
            <div className="form-group">
                <label htmlFor="measurements">Measurements:</label>
                <textarea
                name="measurements"
                id="measurements"
                placeholder="Enter the measurements for the ingredients"
                value={measurements}
                onChange={(e) => setMeasurements(e.target.value)}
                required
                ></textarea>
            </div>

            {/* Instructions */}
            <div className="form-group">
                <label htmlFor="instructions">Instructions:</label>
                <textarea
                name="instructions"
                id="instructions"
                placeholder="Enter the instructions for the recipe"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                required
                ></textarea>
            </div>

            {/* Creator (Read-Only) */}
            <div className="form-group">
                <label htmlFor="creator">Creator:</label>
                <input
                type="text"
                name="creator"
                id="creator"
                value={creator}
                readOnly
                />
            </div>

            <button type="submit" className="submit-btn">
                Submit Recipe
            </button>
            </form>
        </div>
        <Footer />
        </div>
    );
};

export default RecipeInfos;
