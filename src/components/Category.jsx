import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';

const RecipeModal = ({ recipe, isOpen, onClose }) => {
  const [rating, setRating] = useState(recipe ? recipe.rating || 0 : 0);

  if (!isOpen || !recipe) return null;

  const getIngredientsList = (recipe) => {
    let ingredients = [];
    const ingredientsArray = recipe.ingredients ? recipe.ingredients.split(',') : [];
    const measurementsArray = recipe.measurements ? recipe.measurements.split(',') : [];

    for (let i = 0; i < ingredientsArray.length; i++) {
      const ingredient = ingredientsArray[i];
      const measure = measurementsArray[i];
      if (ingredient && ingredient.trim() !== '') {
        ingredients.push({ ingredient, measure });
      }
    }
    return ingredients;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-3/4 md:w-1/2 p-8 shadow-lg relative">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{recipe.recipe_name}</h2>
          <button onClick={onClose} className="text-red-500 font-bold text-lg">X</button>
        </div>

        <h2 className="text-3xl font-semibold text-center text-gray-800">{recipe.strMeal}</h2>

        {/* Recipe Image */}
        <div className="flex justify-center my-4">
          <img
            src={`http://localhost/webPHP/${recipe.dish_image}`}
            alt={recipe.recipe_name}
            className="w-full h-60 object-cover rounded-lg mb-4"
          />
        </div>

        {/* Rating System */}
        <div className="flex justify-center my-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-xl cursor-pointer ${star <= rating ? 'text-yellow-500' : 'text-gray-400'}`}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>

        {/* Ingredients and Measurements */}
        <div className="flex gap-4 my-6">
          <div className="p-4 bg-[#ACE1AF] rounded-md shadow-md w-1/2">
            <h3 className="font-bold text-lg mb-2">Ingredients</h3>
            <ul className="list-none text-justify">
              {getIngredientsList(recipe).map((item, index) => {
                  const emoji = "🍴";
                  return <li key={index}> {emoji} {item.ingredient?.trim()}
                </li>
              })}
            </ul>
          </div>

          <div className="p-4 bg-[#ACE1AF] rounded-md shadow-md w-1/2">
            <h3 className="font-bold text-lg mb-2">Measurements</h3>
            <ul className="list-none text-justify">
              {getIngredientsList(recipe).map((item, index) => (
                <li key={index} >
                  {item.measure?.trim() || 'No measurement available'}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4">
          <h3 className="font-semibold text-lg">Instructions:</h3>
          <p>{recipe.instructions || 'No instructions available'}</p>
        </div>
      </div>
    </div>
  );
};

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://www.themealdb.com/api/json/v1/1/categories.php');
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('http://localhost/webPHP/get-recipes.php');
        if (Array.isArray(response.data)) {
          setRecipes(response.data);
        } else {
          console.error('Invalid data structure:', response.data);
          setRecipes([]);
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setRecipes([]);
      }
    };

    fetchRecipes();
  }, []);

  const openModal = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRecipe(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      <Navbar />
      <div className="main-content">
        <div className="recipes-header">
          <h1 className="font-logo text-5xl pb-5 text-center">Category</h1>
        </div>

        <div className="Categories">
          <div className="section-wrapper bg-whitesmoke">
            <div className="container">
              {/* Category Section */}
              <section className="sc-category grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((category) => {
                  const { idCategory: id, strCategory: title, strCategoryThumb: thumbnail } = category;

                  return (
                    <Link
                      to={`/category/${title}`}
                      className="category-item flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-300 transform hover:scale-105"
                      key={id}
                    >
                      <div className="category-item-img w-full h-40 flex items-center justify-center mb-4">
                        <img
                          src={thumbnail}
                          alt={title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="category-item-title text-center">
                        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                      </div>
                    </Link>
                  );
                })}
              </section>

              {/* Recipes Section */}
              <div className="recipes-section mt-10">
                <h2 className="text-3xl font-bold text-center mb-5">Latest Recipes</h2>
                {recipes.length === 0 ? (
                  <p className="text-center">No recipes available</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {recipes.map((recipe) => {
                      const { id, recipe_name, dish_image } = recipe;
                      const imageUrl = dish_image
                        ? `http://localhost/webPHP/uploads/${dish_image}`
                        : "https://via.placeholder.com/150";

                      return (
                        <div
                          className="recipe-item flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-300 transform hover:scale-105"
                          key={id}
                          onClick={() => openModal(recipe)}
                        >
                          <div className="recipe-item-img w-full h-40 flex items-center justify-center mb-4">
                          <img
                            src={`http://localhost/webPHP/uploads/${recipe.dish_image}`}
                            alt={recipe.recipe_name}
                            className="w-full h-60 object-cover rounded-lg mb-4"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/150";
                            }}
                          />
                          </div>
                          <div className="recipe-item-title text-center">
                            <h3 className="text-lg font-semibold text-gray-800">{recipe_name}</h3>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Modal */}
      <RecipeModal
        recipe={selectedRecipe}
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      <Footer />
    </div>
  );
};

export default CategoryList;