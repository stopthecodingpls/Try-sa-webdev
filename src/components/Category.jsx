import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import { Link } from 'react-router-dom';

const CategoryList = () => {
  const [categories, setCategories] = useState([]); // State variable for categories

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://www.themealdb.com/api/json/v1/1/categories.php');
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <Navbar /> 
      <div className="main-content">
        <div className="recipes-header">
          <h1 className="font-logo text-5xl pb-5 text-center">Category</h1>
        </div>
        <div className="Categories">
          <div className="section-wrapper bg-whitesmoke">
            <div className="container">
              <section className="sc-category grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((category) => {
                  const {
                    idCategory: id,
                    strCategory: title,
                    strCategoryThumb: thumbnail,
                  } = category;

                  return (
                    <Link
                        to={`/category/${title}`}
                        className="category-item flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-300 transform hover:scale-105"
                        key={id}
                    >
                      <div className="category-item-img w-full h-40 flex items-center justify-center mb-4">
                        <img
                          src={thumbnail}
                          alt={title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="category-item-title text-center">
                        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                      </div>
                    </Link>
                  );
                })}
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer /> 
    </div>
  );
};

export default CategoryList;