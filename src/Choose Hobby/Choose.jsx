import React from "react";
import "./Choose.css";
import { Link } from "react-router-dom";

const Choose = () => {
    return (
        <div className="container-choose">
            <div className="signin-header">
                <img src="./../../public/Images/Logo(Nav).png" alt="" />
                <Link to="/home-page" className="go-to-home">Homiee</Link>
            </div>
            <div className="card">
                <div className="content-choose">
                    <div className="search-interest">
                        <h2>Choose Your Interest</h2>
                        <div className="search-bar">
                            <input type="text" placeholder="Search Your Interest" />
                        </div>
                    </div>
                    <div className="interest-container">
                        {["Painting", "Gardening", "Photography", "Cooking", "Wood Working", "Calligraphy", "Musical Instruments", "Hiking", "Collecting", "Gaming", "Pottery", "Cycling", "Blogging", "Chess", "Fitness", "Video editing", "DIY crafting", "Yoga"].map((interest, index) => (
                            <span key={index} className="interest">{interest}</span>
                        ))}
                    </div>
                    <div className="button-container">
                        <button className="next-button">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Choose;
