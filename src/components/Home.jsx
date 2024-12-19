import React from "react";
import Navbar from "./Navbar";
import "./Css/Home.css";
import FormImage from "../assets/images/chef.svg";

const HomeSection = () => {
  return (
    <div>
      <Navbar />
      <section className="home-section">
        <h1 className="font-logo">Welcome to Tasty</h1>
        <p>Home of Food Enthusiasts and Home Cooks</p>
        <img className="chef-image" src={FormImage} style={{ display: "block", margin: "0 auto" }}></img>
      </section>
    </div>
  );
};

export default HomeSection;
