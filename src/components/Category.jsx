import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Footer from './Footer';
import Navbar from './Navbar';

const RecipeModal = ({ recipe, isOpen, onClose, handleFeedbackSubmit }) => {
  const [rating, setRating] = useState(recipe ? recipe.rating || 0 : 0);
  const [feedbackText, setFeedbackText] = useState('');
  const [showAllFeedback, setShowAllFeedback] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (feedbackText.trim() || rating) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    if (isOpen) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [feedbackText, rating, isOpen]);

  if (!isOpen || !recipe) return null;

  const getIngredientsList = (recipe) => {
    let ingredients = [];
    const ingredientsArray = recipe.ingredients ? recipe.ingredients.split(',') : [];
    const measurementsArray = recipe.measurements ? recipe.measurements.split(',') : [];
    const instructionsArray = recipe.instructions ? recipe.instructions.split(',') : [];

    for (let i = 0; i < ingredientsArray.length; i++) {
      const ingredient = ingredientsArray[i];
      const measure = measurementsArray[i];
      const instructions = instructionsArray[i];
      if (ingredient && ingredient.trim() !== '') {
        ingredients.push({ ingredient, measure, instructions });
      }
    }
    return ingredients;
  };

  const submitFeedback = async () => {
    await handleFeedbackSubmit(recipe.id, feedbackText, rating);
    setFeedbackText('');
    setRating(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-4/5 md:w-3/4 lg:w-[60%] max-h-[90vh] overflow-y-auto p-8 shadow-lg relative border-4 border-green-500">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{recipe.recipe_name}</h2>
          <button onClick={onClose} className="text-red-500 font-bold text-lg">X</button>
        </div>

        <div className="flex justify-center my-4">
          <img
            src={`http://localhost/webPHP/uploads/${recipe.dish_image}`}
            alt={recipe.recipe_name}
            className="w-90 h-80 object-cover rounded-lg mb-4"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "http://localhost/webPHP/uploads/NoImage.png";
            }}
          />
        </div>

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

        <div className="flex gap-4 my-6">
          <div className="p-4 bg-[#ACE1AF] rounded-md shadow-md w-1/2">
            <h3 className="font-bold text-center mb-2">Ingredients</h3>
            <ul className="space-y-2">
              {getIngredientsList(recipe).map((item, index) => (
                <li
                  key={index}
                  className="bg-white p-2 rounded-md shadow-md flex items-center justify-between"
                >
                  <span className="text-gray-800">🍴 {item.ingredient?.trim()}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-[#ACE1AF] rounded-md shadow-md w-1/2">
            <h3 className="font-bold text-center mb-2">Measurements</h3>
            <ul className="space-y-2">
              {getIngredientsList(recipe).map((item, index) => (
                <li
                  key={index}
                  className="bg-white p-2 rounded-md shadow-md flex items-center justify-between"
                >
                  <span className="text-gray-800">{item.measure?.trim() || 'No measurement available'}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="p-4 bg-[#ACE1AF] rounded-md shadow-md w-1/8">
          <h3 className="font-bold text-center mb-2">Instructions:</h3>
          <ul className="space-y-2">
            {getIngredientsList(recipe).map((item, index) => (
              <li
                key={index}
                className="bg-white p-2 rounded-md shadow-md flex items-center justify-between"
              >
                <span className="text-gray-800">{item.instructions?.trim() || 'No instructions available'}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-lg">Ratings and Feedback:</h3>
          {recipe.feedback && recipe.feedback.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recipe.feedback
                  .slice(0, showAllFeedback ? recipe.feedback.length : 4)
                  .map((item, index) => (
                    <div key={index} className="p-4 bg-[#ACE1AF] rounded-md my-2">
                      <ul className="space-y-2">
                        <li>
                          <strong>Rating:</strong>
                          {Array.from({ length: item.rating }).map((_, starIndex) => (
                            <span key={starIndex} className="text-black-500">★</span>
                          ))}
                        </li>
                        <li><strong>Feedback:</strong> {item.feedback}</li>
                      </ul>
                    </div>
                  ))}
              </div>
              {recipe.feedback.length > 4 && (
                <div className="flex justify-center mt-4">
                  <button 
                    onClick={() => setShowAllFeedback(!showAllFeedback)}
                    className="bg-[#ACE1AF] text-black px-60 py-2 rounded-md flex items-center justify-center space-x-3"
                  >
                    <span className="w-6 h-6 bg-white text-black rounded-full flex items-center justify-center">
                      {showAllFeedback ? '▲' : '▼'}
                    </span>
                    <span><b>{showAllFeedback ? 'See less' : 'See more'}</b></span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <p>No feedback available yet.</p>
          )}
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2">Leave Feedback</h3>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Share your thoughts about this recipe"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={submitFeedback}
              className="bg-blue-500 text-white p-2 rounded-md"
            >
              Submit Feedback
            </button>
          </div>
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
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(0);

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
          setRecipes([]);
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  const openModal = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Disable body scrolling
  };

  const closeModal = () => {
    setFeedbackText('');
    setRating(0);
    setSelectedRecipe(null);
    setIsModalOpen(false);
    document.body.style.overflow = 'auto'; // Re-enable body scrolling
  };

  const handleFeedbackSubmit = async (recipeId, feedbackText, rating) => {
    if (!feedbackText.trim()) {
      toast.error('Feedback cannot be empty or just spaces.');
      return;
    }

    if (!rating) {
      toast.error('Please provide a rating.');
      return;
    }

    try {
      const response = await axios.post('http://localhost/webPHP/save_feedback.php', {
        Recipe_id: recipeId,
        Feedback: feedbackText,
        Rating: rating,
      });
      if (response.data.success) {
        toast.success('Feedback submitted successfully!');
        closeModal();
        setTimeout(() => {
          window.location.reload();
        }, 300);
      } else {
        toast.error(`Failed to submit feedback: ${response.data.message}`);
      }
    } catch (error) {
      toast.error('Error submitting feedback.');
    }
  };

  const calculateAverageRating = (feedback) => {
    if (Array.isArray(feedback) && feedback.length > 0) {
      const validRatings = feedback
        .map((item) => parseFloat(item.rating))
        .filter((rating) => !isNaN(rating));

      if (validRatings.length === 0) return 0;

      const totalRating = validRatings.reduce((acc, rating) => acc + rating, 0);
      return (totalRating / validRatings.length).toFixed(1);
    }
    return 0;
  };

  return (
    <div>
      <Navbar />
      <div className="main-content">
        <div className="recipes-header">
          <h1 className="font-logo text-5xl pb-5 text-center">Category</h1>
        </div>
        <div className="Categories">
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => {
              const { idCategory: id, strCategory: title, strCategoryThumb: thumbnail } = category;
              return (
                <Link
                  to={`/category/${title}`}
                  className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105"
                  key={id}
                >
                  <img src={thumbnail} alt={title} className="w-full h-40 object-cover rounded-lg" />
                  <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                </Link>
              );
            })}
          </section>
        </div>
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-center mb-5 font-logo text-4xl">Latest Recipes</h2>
          {recipes.length === 0 ? (
            <p className="text-center">No recipes available</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-6">
              {recipes.map((recipe) => {
                const { id, recipe_name, dish_image, feedback } = recipe;
                const imageUrl = dish_image
                  ? `http://localhost/webPHP/uploads/${dish_image}`
                  : "http://localhost/webPHP/uploads/NoImage.png";
                const averageRating = calculateAverageRating(feedback);
                return (
                  <div
                    className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105"
                    key={id}
                    style={{ width: "300px" }}
                    onClick={() => openModal(recipe)}
                  >
                    <img
                      src={imageUrl}
                      alt={recipe_name}
                      className="w-full h-[200px] object-cover rounded-lg mb-4"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                    <h3 className="text-lg font-semibold text-gray-800">{recipe_name}</h3>
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <span>Rating:</span>
                      {averageRating > 0 ? (
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <span
                              key={index}
                              className={`text-xl ${
                                index < Math.round(averageRating) ? 'text-yellow-500' : 'text-gray-400'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                          <span className="ml-2">({averageRating})</span>
                        </div>
                      ) : (
                        <span>No ratings yet</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <RecipeModal
        recipe={selectedRecipe}
        isOpen={isModalOpen}
        onClose={closeModal}
        handleFeedbackSubmit={handleFeedbackSubmit}
        feedbackText={feedbackText}
        setFeedbackText={setFeedbackText}
        rating={rating}
        setRating={setRating}
      />
      <Footer />
    </div>
  );
};

export default CategoryList;