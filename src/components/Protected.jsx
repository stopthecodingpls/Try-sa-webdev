import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Protected = (props) => {
    const navigate = useNavigate();
    const { Component } = props;
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        let login = localStorage.getItem("login");
        if (!login) {
            localStorage.setItem("loginStatus", "Login First Before Accessing The Page");
            navigate("/");
        } else {
            setIsAuthenticated(true);
        }
    }, [navigate]);

    if (!isAuthenticated) {
        return null; 
    }

    return (
        <Component />
    );
}

export default Protected;