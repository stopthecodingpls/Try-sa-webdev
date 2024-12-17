import React from "react";
import "./Css/Navbar.css";

const Navbar = () => {
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
      </ul>
      <button className="logout-btn">Logout</button>
    </nav>
  );
};

export default Navbar;
