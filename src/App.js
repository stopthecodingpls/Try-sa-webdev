import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddRecipes from "./components/AddRecipes";
import "./components/Css/App.css";
import Home from "./components/Home";
import LoginPage from "./components/LoginPage";
import NoPage from "./components/NoPage";
import Protected from "./components/Protected";
import Recipes from "./components/Recipes";
import RegisterPage from "./components/RegisterPage";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<RegisterPage/>} />
          <Route path="/home" element={<Protected Component={Home} />} />
          <Route path="/Recipes" element={<Recipes/>} />
          <Route path="/AddRecipes" element={<AddRecipes/>} />
          <Route path="*" element={<NoPage />} />
        </Routes>
        </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
