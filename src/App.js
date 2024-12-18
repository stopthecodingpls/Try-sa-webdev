import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import NoPage from "./components/NoPage";
import Home from "./components/Home";
import Protected from "./components/Protected";
import "./components/Css/App.css";

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
          <Route path="*" element={<NoPage />} />
        </Routes>
        </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
