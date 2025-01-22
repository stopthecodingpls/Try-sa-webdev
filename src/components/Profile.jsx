import React, { useEffect, useState } from "react";
import "./Css/Profile.css";
import Footer from "./Footer";
import Navbar from "./Navbar";

const ViewProfile = () => {
    const [userData, setUserData] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            const firstname = localStorage.getItem("firstname");
            if (!firstname) {
                console.error("Firstname not found in localStorage");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch("http://localhost/webPHP/getProfileData.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ firstname }),
                });

                const data = await response.json();

                if (data.error) {
                    console.error(data.error);
                } else {
                    setUserData(data.user || null);
                    setRecipes(data.recipes || []);
                    setFeedbacks(data.feedbacks || []);
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const handleDelete = async () => {
        if (!selectedRecipe) return;
        
        try {
            const response = await fetch(`http://localhost/webPHP/delete_recipe.php?id=${selectedRecipe}`, {
                method: "DELETE",
            });
            
            if (response.ok) {
                setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== selectedRecipe));
                setShowModal(false);
            } else {
                console.error("Failed to delete recipe");
            }
        } catch (error) {
            console.error("Error deleting recipe:", error);
        }
    };

    const openModal = (recipeId) => {
        setSelectedRecipe(recipeId);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedRecipe(null);
    };

    if (loading) {
        return <div className="page-container"><p>Loading...</p></div>;
    }

    return (
        <div className="page-container">
            <Navbar />
            <div className="view-wrapper">
                <div className="left-column">
                    {userData ? (
                        <div className="profile-section">
                            <h2 className="font-logo text-4xl">👨‍🍳 Profile Information</h2>
                            <p>
                                <strong>Name:</strong> {userData.firstname} {userData.lastname}
                            </p>
                            <p>
                                <strong>Email:</strong> {userData.email}
                            </p>
                        </div>
                    ) : (
                        <p>Profile data unavailable.</p>
                    )}

                    <div className="addedRecipes-section">
                        <h2 className="font-logo text-4xl">🍽️ Added Recipes</h2>
                        {recipes.length > 0 ? (
                            <ul>
                                {recipes.map((recipe, index) => (
                                    <li key={index}>
                                        <span className="addedRecipe-name">🍴{recipe.recipe_name}</span>
                                        <button 
                                            onClick={() => openModal(recipe.id)} 
                                            className="delete-button"
                                        >
                                            Delete
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No recipes added.</p>
                        )}
                    </div>
                </div>
                <div className="right-column">
                    <div className="feedback-section">
                        <h2 className="font-logo text-4xl">⭐ Feedbacks</h2>
                        {feedbacks.length > 0 ? (
                            feedbacks.map((feedback, index) => {
                                const recipeName = recipes.find(
                                    recipe => recipe.id === feedback.Recipe_id
                                )?.recipe_name || "Unknown Recipe";

                                return (
                                    <div key={index} className="feedback-item">
                                        <p>
                                            <strong>Recipe:</strong> {recipeName}
                                        </p>
                                        <p>
                                            <strong>Feedback:</strong> {feedback.text}
                                        </p>
                                        <p>
                                            <strong>Rating:</strong> {feedback.rating}/5
                                        </p>
                                    </div>
                                );
                            })
                        ) : (
                            <p>No feedback available.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal for Delete Confirmation */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="profModal-content">
                        <h3>Are you sure you want to delete this recipe?</h3>
                        <div className="modal-buttons">
                            <button onClick={handleDelete} className="confirm-button">
                                Confirm
                            </button>
                            <button onClick={closeModal} className="cancel-button">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default ViewProfile;
