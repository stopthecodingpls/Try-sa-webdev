import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "./Css/Navbar.css";

const Navbar = () => {
  const [menuActive, setMenuActive] = useState(false);
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('role'); 
    setRole(userRole);
  }, []);

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
          <a href="/Category">Recipes</a>
        </li>
        {role !== 'food_enthusiast' && (
          <li>
            <a href="/AddRecipes">Add Recipes</a>
          </li>
        )}
        <li>
          <a href="/AboutUs">About Us</a>
        </li>
        {role !== 'food_enthusiast' && (
        <li>
          <a href="/Profile">Profile</a>
        </li>
        )}
        <li>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
