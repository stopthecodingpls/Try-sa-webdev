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
          <a href="/Home">Home</a>
        </li>
        <li className="recipes">
          <a>Recipes</a>
          <ul className="dropdown">
            <li>
              <a href="/Own_Recipe">Own Recipe</a>
            </li>
            <li>
              <a href="/Other_Recipe">Other Recipe</a>
            </li>
          </ul>
        </li>
        <li>
          <a href="/About_us">About Us</a>
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
