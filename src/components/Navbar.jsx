import React from "react";
import { useNavigate } from "react-router-dom";
import "./Css/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => { 
    localStorage.clear();
    navigate("/");
  }
  
  const firstName = localStorage.getItem("firstName");

  return (
    <nav className="navbar">
      <div className="logo">Tasty</div>
      <ul className="nav-links">
        <li>
          <a href="HomePage.js">Home</a>
        </li>
        <li>
          <a href="Recipes.js">Recipes</a>
        </li>
        <li>
          <a href="About_us.js">About us</a>
        </li>
        <li>
          <span className="user-name">{firstName}</span>
        </li>
      </ul>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default Navbar;
