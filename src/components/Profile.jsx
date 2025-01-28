import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
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
    const [visibleFeedbackCount, setVisibleFeedbackCount] = useState(4);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedFirstName, setUpdatedFirstName] = useState("");
    const [updatedLastName, setUpdatedLastName] = useState("");

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
    
            const data = await response.json();
    
            if (response.ok && data.message) {
                setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== selectedRecipe));
                setShowModal(false);
                toast.success(data.message);
                window.location.reload();
            } else {
                console.error("Failed to delete recipe:", data.error);
                toast.error(data.error || "Failed to delete recipe");
            }
        } catch (error) {
            console.error("Error deleting recipe:", error);
            toast.error("An error occurred while deleting the recipe.");
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

    const toggleFeedbackVisibility = () => {
        if (visibleFeedbackCount === 4) {
            setVisibleFeedbackCount(feedbacks.length);
        } else {
            setVisibleFeedbackCount(4);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setUpdatedFirstName(userData.firstname);
        setUpdatedLastName(userData.lastname);
    };

    const handleSave = async () => {
        if (!validateInput(updatedFirstName) || !validateInput(updatedLastName)) {
            toast.error("First name and last name cannot be empty, contain only spaces, or start with spaces.");
            return;
        }

        try {
            const response = await fetch("http://localhost/webPHP/updateProfile.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    firstname: updatedFirstName, 
                    lastname: updatedLastName, 
                    email: userData.email 
                }),
            });

            if (response.ok) {
                setUserData((prevData) => ({ 
                    ...prevData, 
                    firstname: updatedFirstName, 
                    lastname: updatedLastName 
                }));
                setIsEditing(false);
                toast.success("Profile updated successfully!");
            } else {
                toast.error("Failed to update profile.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    const validateInput = (input) => {
        return input.trim() !== "" && input[0] !== " ";
    };

    const handleCancel = () => {
        setIsEditing(false);
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
                                <strong>First name: </strong>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={updatedFirstName}
                                        onChange={(e) => setUpdatedFirstName(e.target.value)}
                                        className="border-2 border-black px-2 rounded"
                                    />
                                ) : (
                                    ` ${userData.firstname}`
                                )}
                            </p>
                            <p>
                                <strong>Last name: </strong>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={updatedLastName}
                                        onChange={(e) => setUpdatedLastName(e.target.value)}
                                        className="border-2 border-black px-2 rounded"
                                    />
                                ) : (
                                    ` ${userData.lastname}`
                                )}
                            </p>
                            <p>
                                <strong>Email:</strong> {userData.email}
                            </p>
                            <div className="button-container text-right mr-2">
                                {isEditing ? (
                                    <>
                                        <button onClick={handleSave} className="save-button bg-green-400 text-white py-2 px-6 rounded">Save</button>
                                        <button onClick={handleCancel} className="cancel-button bg-red-500 text-white py-2 px-4 rounded">Cancel</button>
                                    </>
                                ) : (
                                    <button onClick={handleEdit} className="edit-button bg-green-400 text-white py-2 px-7 rounded">Edit</button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p>Profile data unavailable.</p>
                    )}

                    <div className="addedRecipes-section">
                        <h2 className="font-logo text-4xl">🍽️ Added Recipes</h2>
                        {recipes.length > 0 ? (
                            <ul>
                                {recipes.map((recipe, index) => {
                                    const recipeFeedbacks = feedbacks.filter(feedback => feedback.Recipe_id === recipe.id);

                                    const averageRating = calculateAverageRating(recipeFeedbacks);

                                    return (
                                        <li key={index}>
                                            <span className="addedRecipe-name">
                                                🍴<b>{recipe.recipe_name}{" "}</b>
                                                <span style={{ fontSize: "0.9em", color: "black" }}>
                                                    ({averageRating > 0 ? `${averageRating}/5` : "No Ratings"})
                                                </span>
                                            </span>
                                            <button
                                                onClick={() => openModal(recipe.id)}
                                                className="delete-button"
                                            >
                                                Delete
                                            </button>
                                        </li>
                                    );
                                })}
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
                            feedbacks.slice(0, visibleFeedbackCount).map((feedback, index) => {
                                const recipeName = recipes.find(
                                    recipe => recipe.id === feedback.Recipe_id
                                )?.recipe_name || "Unknown Recipe";

                                const renderStars = (rating) => {
                                    const totalStars = 5;
                                    const filledStars = Math.round(rating);
                                    const emptyStars = totalStars - filledStars;
                                    return (
                                        <>
                                            {Array(filledStars).fill("★").map((star, i) => (
                                                <span key={`filled-${i}`} className="filled-star">
                                                    {star}
                                                </span>
                                            ))}
                                            {Array(emptyStars).fill("☆").map((star, i) => (
                                                <span key={`empty-${i}`} className="empty-star">
                                                    {star}
                                                </span>
                                            ))}
                                        </>
                                    );
                                };

                                return (
                                    <div key={index} className="feedback-item">
                                        <p>
                                            <strong>Recipe:</strong> {recipeName}
                                        </p>
                                        <p>
                                            <strong>Feedback:</strong> {feedback.text}
                                        </p>
                                        <p>
                                            <strong>Rating:</strong> {renderStars(feedback.rating)}
                                        </p>
                                    </div>
                                );
                            })
                        ) : (
                            <p>No feedback available.</p>
                        )}
                        {feedbacks.length > 4 && (
                            <button 
                                onClick={toggleFeedbackVisibility} 
                                className="text-black font-semibold py-2 px-6 w-full max-w-sm mx-auto rounded-3xl transition-all duration-200 shadow-md text-center"
                            >
                                {visibleFeedbackCount === 4 ? "See More" : "See Less"}
                            </button>
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
