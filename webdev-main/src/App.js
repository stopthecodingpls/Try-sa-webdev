import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import NoPage from "./components/NoPage";
import Navbar from "./component/Navbar";
import Home from "./component/Home";
import "./component/Css/App.css";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="App">
      {/* BrowserRouter is used to handle routing in the application */}
      <BrowserRouter>
        {user && <Navbar />} {/* Show Navbar only when user is logged in */}
        <Routes>
          {/* Route for the login page */}
          <Route path="/" element={<LoginPage setUser={setUser} />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          {/* Route for the registration page */}
          <Route path="/register" element={<RegisterPage setUser={setUser} />} />
          {/* Route for the home page, only accessible if user is logged in */}
          {user && <Route path="/home" element={<Home />} />}
          {/* Route for handling 404 - Page Not Found */}
          <Route path="*" element={<NoPage />} />
        </Routes>
        </BrowserRouter>
      {/* ToastContainer is used to display toast notifications */}
      <ToastContainer />
    </div>
  );
}

export default App;
