import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AboutUs from "./components/AboutUs";
import AddRecipes from "./components/AddRecipes";
import Category from "./components/Category";
import "./components/Css/App.css";
import Home from "./components/Home";
import LoginPage from "./components/LoginPage";
import NoPage from "./components/NoPage";
import Protected from "./components/Protected";
import RecipeInfos from "./components/RecipeInfos";
import Recipes from "./components/Recipes";
import RegisterPage from "./components/RegisterPage";
import Profile from "./components/Profile";
import ProfileFE from "./components/ProfileFE";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<RegisterPage/>} />
          <Route path="/home" element={<Protected Component={Home} />} />
          <Route path="/AddRecipes" element={<Protected Component ={AddRecipes} restrictedRole="food_enthusiast" redirectTo="/home"/>} />
          <Route path="/RecipeInfo" element={<RecipeInfos />} />
          <Route path="/Category" element={<Protected Component = {Category}/>} />
          <Route path="/category/:category" element={<Protected Component = {Recipes} />} />
          <Route path="/AboutUs" element={<Protected Component ={AboutUs} />} />
          <Route path="/Profile" element={<Protected Component={Profile} restrictedRole="food_enthusiast" redirectTo="/home" />} />
          <Route path="/ProfileFE" element={<Protected Component={ProfileFE} restrictedRole="chef" redirectTo="/home" />} />


          <Route path="*" element={<NoPage />} />
        </Routes>
        </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
