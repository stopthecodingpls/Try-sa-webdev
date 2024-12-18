import React from "react";
import Navbar from "./Navbar";
import "./Css/Home.css";

const HomeSection = () => {
  return (
    <div>
    <Navbar />
    <section className="home-section">
      <h1>Welcome to Tasty</h1>
      <p>Home of Food Enthusiasts and Home Cooks</p>
    </section>
    </div>
  );
};

export default HomeSection;
