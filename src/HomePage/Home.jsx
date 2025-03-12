import React from "react";
import "./Home.css";


const Home = () => {
    return (
        <div className="container">
            <div className="header">
                <img src="./../assets/Images/Logo(Nav) (1).png" />
                <span className="logo-text">Homiee</span>
            </div>
            <div className="content">
                <div className="text-section">
                    <h1 className="title">BEST COMMUNITY FOR YOUR INTEREST</h1>
                    <p className="description">
                        It will customize your own space to talk. As well as to easily
                        connect with a diverse community of your own interest.
                    </p>
                </div>
                <div className="buttons-section">
                    <div className="buttons">
                        <button className="login-btn">Log in</button>
                        <div className="icon-container">
                            <img src="./../assets/Images/Logo(Nav) (1).png" alt="" />
                        </div>
                        <button className="signup-btn">Sign Up Now</button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Home;
