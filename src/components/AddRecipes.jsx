import React from "react";
import { useNavigate } from "react-router-dom";
import FormImage from "../assets/images/Cooking.svg";
import "./Css/AddRecipes.css";
import Footer from "./Footer";
import Navbar from "./Navbar";

const YourOwnRecipes = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <Navbar />
      <div className="wrapper">
        <div className="container">
          <h1 className="font-logo text-5xl">Recipe Information</h1>
          <p>Create and Share your own recipe to other food enthusiasts and home cooks</p>
          <button
            className="add-recipe-btn"
            onClick={() => navigate("/RecipeInfo")}
          >
            Add Recipe
          </button>
        </div>
        <img className="chef-image" src={FormImage} alt="Chef illustration" />
      </div>
      <Footer />
    </div>
  );
};

export default YourOwnRecipes;
