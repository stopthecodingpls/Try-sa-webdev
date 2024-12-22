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
        <li>
          <a href="/Recipes">Recipes</a>
        </li>
        <li>
          <a href="/Add_Recipes">Add Recipes</a>
        </li>
        <li>
          <a href="/About_us">About Us</a>
        </li>
        <li>
          <span className="user-name">{firstName}</span>
        </li>
        <li>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
