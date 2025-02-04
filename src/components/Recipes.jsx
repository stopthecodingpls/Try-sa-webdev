import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Css/Recipes.css';
import Footer from "./Footer";
import Navbar from "./Navbar";

const Recipes = () => {
  const { category } = useParams();
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [rating, setRating] = useState(0);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [recipeDetails, setRecipeDetails] = useState(null); // to store the recipe details

  useEffect(() => {
    const fetchRecipes = async (category) => {
      try {
        const response = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
        );
        setRecipes(response.data.meals || []);
        setFilteredRecipes(response.data.meals || []);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    if (category) {
      fetchRecipes(category);
    }
  }, [category]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Fetch the full details of the selected recipe, including ingredients
  const fetchRecipeDetails = async (recipeName) => {
    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeName}`
      );
      setRecipeDetails(response.data.meals[0] || null); // Get the first meal from the response
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    fetchRecipeDetails(recipe.strMeal); // Fetch recipe details when clicked
    const modal = document.getElementById("recipeModal");
    if (modal) {
      modal.style.display = "block";
      document.body.style.overflow = "hidden";
    }
  };

  const closeModal = () => {
    setSelectedRecipe(null);
    setRecipeDetails(null); // Reset the recipe details
    setRating(0);
    const modal = document.getElementById("recipeModal");
    if (modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
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

  const filteredRecipesFavorites = recipes.filter((recipe) =>
    recipe.strMeal.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedRecipes = showFavorites
    ? filteredRecipesFavorites.filter((recipe) => favorites.includes(recipe.idMeal))
    : filteredRecipesFavorites;

  const getIngredientsList = (recipe) => {
    let ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== '') {
        ingredients.push(`${ingredient} - ${measure}`);
      }
    }
    return ingredients;
  };

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

        <button
          className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600"
          onClick={() => window.location.href = '/Category'}
        >
          Back
        </button>

        <div className="recipes-header">
          <h1 className = "font-logo text-5xl pb-5 text-center">Recipes</h1>
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

        {selectedRecipe && recipeDetails && (
          <div id="recipeModal" className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>&times;</span>
              <h2>{recipeDetails.strMeal}</h2>
              <img src={recipeDetails.strMealThumb} alt={recipeDetails.strMeal} className="modal-image" />
              <br></br>

              <div className="flex gap-4">
            {/* Ingredients Box */}
            <div className="p-4 bg-[#ACE1AF] rounded-md shadow-md w-1/2">
              <h3 className="font-bold text-lg mb-2">Ingredients</h3>
              <ul className="list-none text-justify">
                {getIngredientsList(recipeDetails).map((item, index) => {
                  const [ingredient] = item.split(" - "); // Split 
                  const emoji = "🍴"; // Default emoji
                  return <li key={index}> {emoji} {ingredient.trim()}</li>;
                })}
              </ul>
            </div>

            {/* Measurements Box */}
            <div className="p-4 bg-[#ACE1AF] rounded-md shadow-md w-1/2">
              <h3 className="font-bold text-lg mb-2">Measurements</h3>
                <ul className="list-none text-justify">
                {getIngredientsList(recipeDetails).map((item, index) => {
                  const [, measurement] = item.split(" - "); // Split 
                  return <li key={index}>{measurement?.trim()}</li>;
                })}
              </ul>
            </div>
          </div>
          <br></br>
          
            <div className="p-4 bg-[#ACE1AF] rounded-md shadow-md w-1/8">
              <h3 className="font-bold text-center mb-2">Instructions:</h3>
                <ul className="list-none text-justify">
                  {recipeDetails.strInstructions.split(". ").map((step, index) => (
                      step.trim() && (
                        <li key={index} className="p-2 bg-white rounded-md shadow-sm mb-2">{step}.</li>
                      )
                    ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Recipes;
