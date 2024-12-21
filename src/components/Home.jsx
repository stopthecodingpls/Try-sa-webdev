import React from "react";
import FormImage from "../assets/images/chef.svg";
import "./Css/Home.css";
import Footer from "./Footer";
import Navbar from "./Navbar";

const HomeSection = () => {
  return (
    <div>
      <Navbar />
      <section className="home-section">
        <h1 className="font-logo">Welcome to Tasty</h1>
        <p className="font-logo">Home of Food Enthusiasts and Home Cooks</p>
        <div className="bordered-section">
          <img className="chef-image" src={FormImage} alt="Chef illustration" style={{ display: "block", margin: "0 auto" }}/>
          <p>
            Explore a world of culinary inspiration with our various collection
            of recipes suitable for any occasion. We provide step-by-step
            instructions for quick and easy meals as well as stunning dishes for
            special occasions. Discover key cooking methods, how to choose the
            freshest ingredients, and how to add unique twists to classic
            dishes. Whether you're a seasoned chef or a first-time home cook,
            our recipes are meant to inspire you and bring joy to your table.
          </p>
        </div>
        <div className="bordered-section">
          <p>
            Explore a world of culinary inspiration with our various collection
            of recipes suitable for any occasion. We provide step-by-step
            instructions for quick and easy meals as well as stunning dishes for
            special occasions. Discover key cooking methods, how to choose the
            freshest ingredients, and how to add unique twists to classic
            dishes. Whether you're a seasoned chef or a first-time home cook,
            our recipes are meant to inspire you and bring joy to your table.
          </p>
          <img className="chef-image" src={FormImage} alt="Chef illustration" style={{ display: "block", margin: "0 auto" }}/>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HomeSection;
