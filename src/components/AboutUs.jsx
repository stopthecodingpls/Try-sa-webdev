import React from 'react';
import FormImage from "../assets/images/About.svg";
import './Css/AboutUs.css';
import Footer from "./Footer";
import Navbar from "./Navbar";

const About_us = () => {
return (
    <div className="page-container">
    <Navbar />
    <div className="wrapper">
        <div className="container">
            <h1>Tasty</h1>
            <p>Tasty is an interactive website for food lovers and home cooks. It is a hub for finding recipes ranging from quick and easy to 
                gourmet level. Users can browse a wide variety of dishes, each with detailed instructions and ingredient lists, making cooking 
                enjoyable and hassle-free. Users can upload their own recipes, allowing them to share their unique ideas with other food lovers and 
                home cooks. Users can also rate other recipes to sort their favorite recipes and bookmark them for easy access.
            </p>
        </div>
        <img className="about-image" src={FormImage} alt="About illustration" />
    </div>
    <Footer />
    </div>
);
};

export default About_us;
