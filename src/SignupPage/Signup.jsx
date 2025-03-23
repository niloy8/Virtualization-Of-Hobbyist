import React from "react";
import "./Signup.css";
import { Link } from "react-router-dom";

const Signup = () => {
    return (

        <div className="signin-container">
            <div className="signin-header">
                <img src="./../../public/Images/Logo(Nav).png" alt="" />
                <Link to="/home-page" className="go-to-home">Homiee</Link>
            </div>
            <div className="signup-card">
                <h2 className="signup-title">Sign Up</h2>
                <div className="signup-input-group">
                    <input type="text" placeholder="First Name" className="signup-input half-input" />
                    <input type="text" placeholder="Last Name" className="signup-input half-input" />
                </div>
                <input type="text" placeholder="User Name" className="signup-input full-input" />
                <input type="email" placeholder="E-Mail" className="signup-input full-input" />
                <input type="password" placeholder="Password" className="signup-input full-input" />
                <button className="signup-btn">Sign Up</button>
                <div className="signup-google-btn">
                    <img src="./../../public/google-search 1.png" />
                    Log in with Google
                </div>
                <div className="signup-footer">
                    <Link to="/sign-in" className="signup-login-link">Already have an account? Log in</Link>
                </div>
            </div>

        </div>
    );
};

export default Signup
