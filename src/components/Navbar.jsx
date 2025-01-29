import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Css/Navbar.css";

const Navbar = () => {
  const [menuActive, setMenuActive] = useState(false);
  const [role, setRole] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole);
  }, []);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  const handleLogout = () => {
    setIsModalOpen(true);
  };

  const confirmLogout = () => {
    localStorage.clear();
    navigate("/");
    setIsModalOpen(false);
  };

  const isActive = (path) => (location.pathname === path ? "active-link" : "");

  return (
    <>
      <div className={`${isModalOpen ? "pointer-events-none" : ""}`}>
        <nav className="navbar">
          <div className="font-logo text-4xl">Tasty</div>
          <div className="hamburger" onClick={toggleMenu}>
            ☰
          </div>
          <ul className={`nav-links ${menuActive ? "active" : ""}`}>
            <li className={isActive("/Home")}>
                <Link to="/Home">Home</Link>
            </li>
            <li className={isActive("/Category")}>
                <Link to="/Category">Recipes</Link>
            </li>
            {role !== "food_enthusiast" && (
              <li className={isActive("/AddRecipes")}>
                <Link to="/AddRecipes">Add Recipes</Link>
              </li>
            )}
            <li className={isActive("/AboutUs")}>
                <Link to="/AboutUs">About Us</Link>
            </li>
            {role !== "food_enthusiast" && (
              <li className={isActive("/Profile")}>
                <Link to="/Profile">Profile</Link>
              </li>
            )}
            {role !== "chef" && (
              <li className={isActive("/ProfileFE")}>
                <Link to="/ProfileFE">Profile</Link>
              </li>
            )}
            <li>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 relative z-50">
            <h2 className="text-3xl font-logo">Confirm Logout</h2>
            <p className="mt-2 text-gray-600">Are you sure you want to logout?</p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={confirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
