import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Css/Recipes.css';
import Footer from "./Footer";
import Navbar from "./Navbar";

const Recipes = () => {
const [recipes, setRecipes] = useState([]);
const [selectedRecipe, setSelectedRecipe] = useState(null);
const [favorites, setFavorites] = useState([]);
const [showFavorites, setShowFavorites] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
const [rating, setRating] = useState(0);

useEffect(() => {
    const fetchRecipes = async () => {
    try {
        const response = await axios.get('https://www.themealdb.com/api/json/v1/1/search.php?s=');
        setRecipes(response.data.meals);
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
    };

    fetchRecipes();
}, []);

const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    document.getElementById("recipeModal").style.display = "block";
};

const closeModal = () => {
    setSelectedRecipe(null);
    setRating(0);
    document.getElementById("recipeModal").style.display = "none";
};

const toggleFavorite = (recipe) => {
    setFavorites((prevFavorites) => {
    if (prevFavorites.includes(recipe.idMeal)) {
        return prevFavorites.filter((id) => id !== recipe.idMeal);
    } else {
        return [...prevFavorites, recipe.idMeal];
    }
    });
};

const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
};

const handleRatingClick = (rate) => {
    setRating(rate);
};

const filteredRecipes = recipes.filter((recipe) =>
    recipe.strMeal.toLowerCase().includes(searchQuery.toLowerCase())
);

const sortedRecipes = showFavorites
    ? filteredRecipes.filter((recipe) => favorites.includes(recipe.idMeal))
    : filteredRecipes;

return (
    <div>
    <Navbar />
    <div className="main-content">
        <div className="search-bar">
        <input
            type="text"
            placeholder="Find Recipe"
            className="search-input"
            value={searchQuery}
            onChange={handleSearchChange}
        />
        <button className="search-button">🔍</button>
        </div>

        <div className="recipes-header">
        <h1>Recipes</h1>
        <button className="favorites-button" onClick={() => setShowFavorites(!showFavorites)}>
            {showFavorites ? 'Show All' : 'Show Favorites'}
        </button>
        </div>

        <div className="recipe-list">
        {sortedRecipes.length > 0 ? (
            sortedRecipes.map((recipe) => (
            <div className="recipe-item" key={recipe.idMeal} onClick={() => handleRecipeClick(recipe)}>
                <img src={recipe.strMealThumb} alt={recipe.strMeal} className="recipe-image" />
                <div className="recipe-name">
                {recipe.strMeal}
                <button className="star-button" onClick={(e) => { e.stopPropagation(); toggleFavorite(recipe); }}>
                    {favorites.includes(recipe.idMeal) ? '★' : '☆'}
                </button>
                </div>
            </div>
            ))
        ) : (
            <p>No recipe/s found</p>
        )}
        </div>

        {selectedRecipe && (
        <div id="recipeModal" className="modal">
            <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>{selectedRecipe.strMeal}</h2>
            <img src={selectedRecipe.strMealThumb} alt={selectedRecipe.strMeal} className="modal-image" />
            <div className="rating">
                {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={`star ${rating >= star ? 'filled' : ''}`}
                    onClick={() => handleRatingClick(star)}
                >
                    ★
                </span>
                ))}
            </div>
            <h3>Ingredients:</h3>
            <ul>
                {Object.keys(selectedRecipe)
                .filter(key => key.startsWith('strIngredient') && selectedRecipe[key])
                .map(key => (
                    <li key={key}>{selectedRecipe[key]}</li>
                ))}
            </ul>
            <h3>Instructions:</h3>
            {selectedRecipe.strInstructions.split('\n').map((step, index) => (
                <p key={index}>{step}</p>
            ))}
            </div>
        </div>
        )}
    </div>
    <Footer />
    </div>
);
};

export default Recipes;