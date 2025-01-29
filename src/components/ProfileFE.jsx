import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import "./Css/Profile.css";
import Footer from "./Footer";
import Navbar from "./Navbar";

const ViewProfile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedFirstName, setUpdatedFirstName] = useState("");
    const [updatedLastName, setUpdatedLastName] = useState("");
    const [updatedRole, setRole] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfileData = async () => {
            const email = localStorage.getItem("email");
            if (!email) {
                console.error("Email not found in localStorage");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch("http://localhost/webPHP/getProfileData.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                });

                const data = await response.json();

                if (data.error) {
                    console.error(data.error);
                } else {
                    setUserData(data.user || null);
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
        setUpdatedFirstName(userData?.firstname || "");
        setUpdatedLastName(userData?.lastname || "");
        setRole(userData?.role || "");
    };

    const handleSave = async () => {
        if (!validateInput(updatedFirstName) || !validateInput(updatedLastName)) {
            toast.error("First name and last name cannot be empty, contain only spaces, or start with spaces.");
            return;
        }

        try {
            const response = await fetch("http://localhost/webPHP/updateProfile.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    firstname: updatedFirstName, 
                    lastname: updatedLastName, 
                    role: updatedRole,
                    email: userData.email 
                }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setUserData((prevData) => ({ 
                    ...prevData, 
                    firstname: updatedFirstName, 
                    lastname: updatedLastName, 
                    role: updatedRole
                }));

                localStorage.setItem("role", updatedRole);

                toast.success("Profile updated successfully!");

                if (updatedRole === "chef") {
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 1000);
                }

                setIsEditing(false);
            } else {
                toast.error("Failed to update profile.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    const validateInput = (input) => {
        return input.trim().length > 0;
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const getRoleDisplayName = (role) => {
        if (role === "food_enthusiast") return "Food Enthusiast";
        if (role === "chef") return "Chef";
        return "Not specified";
    };

    if (loading) {
        return <div className="page-container"><p>Loading...</p></div>;
    }

    return (
        <div className="page-container">
            <Navbar />
            <div className="view-wrapper">
                <div className="left-column">
                    {userData ? (
                        <div className="profile-section">
                            <h2 className="font-logo text-4xl">👨‍🍳 Profile Information</h2>
                            <p>
                                <strong>First name: </strong>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={updatedFirstName}
                                        onChange={(e) => setUpdatedFirstName(e.target.value)}
                                        className="border-2 border-black px-2 rounded"
                                    />
                                ) : (
                                    ` ${userData.firstname}`
                                )}
                            </p>
                            <p>
                                <strong>Last name: </strong>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={updatedLastName}
                                        onChange={(e) => setUpdatedLastName(e.target.value)}
                                        className="border-2 border-black px-2 rounded"
                                    />
                                ) : (
                                    ` ${userData.lastname}`
                                )}
                            </p>
                            <p>
                                <strong>Email:</strong> {userData.email}
                            </p>
                            <p>
                                <strong>Role: </strong>
                                {isEditing ? (
                                    <div>
                                        <label className="text-gray-800 text-sm mb-1 block">
                                            Select Role <span className="text-red-500">*</span>
                                        </label>
                                        <select 
                                            id="role" 
                                            value={updatedRole} 
                                            onChange={(e) => setRole(e.target.value)} 
                                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#2dc978] focus:border-[#2dc978] block w-full p-2.5"
                                        >
                                            <option value="" disabled>Choose a Role</option>
                                            <option value="chef">Chef</option>
                                            <option value="food_enthusiast">Food Enthusiast</option>
                                        </select>
                                    </div>
                                ) : (
                                    ` ${getRoleDisplayName(userData.role)}`
                                )}
                            </p>
                            <div className="button-container text-right mr-2">
                                {isEditing ? (
                                    <>
                                        <button onClick={handleSave} className="save-button bg-green-400 text-white py-2 px-6 rounded">Save</button>
                                        <button onClick={handleCancel} className="cancel-button bg-red-500 text-white py-2 px-4 rounded">Cancel</button>
                                    </>
                                ) : (
                                    <button onClick={handleEdit} className="edit-button bg-green-400 text-white py-2 px-7 rounded">Edit</button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p>Profile data unavailable.</p>
                    )}
                </div>
            </div> 
            <Footer />
        </div>
    );
};

export default ViewProfile;
