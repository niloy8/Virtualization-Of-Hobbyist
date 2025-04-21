import React, { useState } from "react";
import "./Choose.css";
import { Link, useNavigate } from "react-router-dom";

const allInterests = [
    "Painting", "Gardening", "Photography", "Cooking", "Wood Working", "Calligraphy",
    "Musical Instruments", "Hiking", "Collecting", "Gaming", "Pottery", "Cycling",
    "Blogging", "Chess", "Fitness", "Video editing", "DIY crafting", "Yoga"
];

const Choose = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selected, setSelected] = useState([]);
    const navigate = useNavigate();

    const filteredInterests = allInterests.filter(interest =>
        interest.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleSelect = (interest) => {
        if (selected.includes(interest)) {
            setSelected(selected.filter(i => i !== interest));
        } else {
            setSelected([...selected, interest]);
        }
    };

    const handleNext = async () => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");

        if (!email || !token) {
            alert("User not authenticated!");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/users/hobbies", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ email, hobbies: selected }),
            });

            const data = await res.json();
            if (res.ok) {
                alert("Hobbies updated successfully!");
                navigate("/community-page/profile");
            } else {
                alert(data.error || "Something went wrong!");
            }
        } catch (err) {
            console.error("Error updating hobbies:", err);
        }
    };

    return (
        <div className="container-choose">
            <div className="signin-header">
                <img src="./../../public/Images/Logo(Nav).png" alt="Logo" />
                <Link to="/home-page" className="go-to-home">Homiee</Link>
            </div>
            <div className="card">
                <div className="content-choose">
                    <div className="search-interest">
                        <h2>Choose Your Interest</h2>
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Search Your Interest"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="interest-container">
                        {filteredInterests.map((interest, index) => (
                            <span
                                key={index}
                                className={`interest ${selected.includes(interest) ? "selected" : ""}`}
                                onClick={() => toggleSelect(interest)}
                            >
                                {interest}
                            </span>
                        ))}
                    </div>
                    <div className="button-container">
                        <button className="next-button" onClick={handleNext}>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Choose;
