import React, { useEffect, useState } from "react";
import "./Css/Profile.css";
import Footer from "./Footer";
import Navbar from "./Navbar";


const ViewProfile = () => {
    const [userData, setUserData] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await fetch("http://localhost/webPHP/getProfileData.php");
                const data = await response.json();
  
                setUserData(data.user || null);
                setRecipes(data.recipes || []);
                setFeedbacks(data.feedbacks || []);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setLoading(false);
            }
        };
   
        fetchProfileData();
    }, []);


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


                <div className="recipes-section">
                    <h2 className="font-logo text-4xl">🍽️ Added Recipes</h2>
                    {recipes.length > 0 ? (
                        <ul>
                            {recipes.map((recipe, index) => (
                                <li key={index}>{recipe.recipe_name}</li>
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
            <Footer />
        </div>
    );
};

export default ViewProfile;