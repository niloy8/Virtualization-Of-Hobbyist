import React from "react";
import "./Signup.css";

const Signup = () => {
    return (
        <div className="signup-container">
            <div className="signup-header">
                <i className="fas fa-wifi"></i>
                <span className="signup-brand">Homiee</span>
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
                <button className="signup-google-btn">
                    <img
                        src="https://storage.googleapis.com/a1aa/image/DIOr2n9Kex_X7_8FjTHU5RhvdlP0QKopbyrMNpNzc6Y.jpg"
                        alt="Google logo"
                        className="signup-google-logo"
                    />
                    Sign Up with Google
                </button>
                <div className="signup-footer">
                    <a href="#" className="signup-login-link">Already have an account? Log in</a>
                </div>
            </div>
            <div className="signup-bottom-left">
                <img
                    src="https://storage.googleapis.com/a1aa/image/1LEIfzd49qnPeZkRNPu2UZlzMKSOyyEW5GSCoOg7ENE.jpg"
                    alt="3D robot character"
                    className="signup-robot"
                />
            </div>
            <div className="signup-right">
                <img
                    src="https://storage.googleapis.com/a1aa/image/4Bd8uuPI1ta3eoubhUEO45XY-JjFZLRdvb_VngekrZw.jpg"
                    alt="3D spiral object"
                    className="signup-spiral"
                />
            </div>
        </div>
    );
};

export default Signup
