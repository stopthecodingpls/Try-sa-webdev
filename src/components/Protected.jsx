import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Protected = (props) => {
    const navigate = useNavigate();
    const { Component, restrictedRole, redirectTo } = props;
    const role = localStorage.getItem('role');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        let login = localStorage.getItem("login");
        if (!login) {
            localStorage.setItem("loginStatus", "Login First Before Accessing The Page");
            navigate("/");
        } else {
            if (restrictedRole && role === restrictedRole) {
                navigate(redirectTo); // Redirect if the user has the restricted role
            } else {
                setIsAuthenticated(true);
            }
        }
    }, [navigate, restrictedRole, role, redirectTo]);

    if (!isAuthenticated) {
        return null; 
    }

    return (
        <Component />
    );
}

export default Protected;
