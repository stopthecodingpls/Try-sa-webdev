import React from "react";
import "./Css/HomePage.css";

const HomeSection = () => {
  return (
    <section className="home-section">
      <h1>Welcome to Tasty</h1>
      <p>Home of Food Enthusiasts and Home Cooks</p>
      <img className="chef-image" src="/assets/chef.svg"></img>
    </section>
  );
};

export default HomeSection;
