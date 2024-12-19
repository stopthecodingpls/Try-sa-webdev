import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Css/Navbar.css";

const Navbar = () => {
  const [menuActive, setMenuActive] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  const handleLogout = () => { 
    localStorage.clear();
    navigate("/");
  };
  
  const firstName = localStorage.getItem("firstName");

  return (
    <nav className="navbar">
      <div className="font-logo text-4xl">Tasty</div>
      <div className="hamburger" onClick={toggleMenu}>
        ☰
      </div>
      <ul className={`nav-links ${menuActive ? "active" : ""}`}>
        <li>
          <a href="HomePage.js">Home</a>
        </li>
        <li className="recipes">
          <a href="Recipes.js">Recipes</a>
          <ul className="dropdown">
            <li>
              <a href="#own-recipe">Own Recipe</a>
            </li>
            <li>
              <a href="#other-recipe">Other Recipe</a>
            </li>
          </ul>
        </li>
        <li>
          <a href="About_us.js">About Us</a>
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
