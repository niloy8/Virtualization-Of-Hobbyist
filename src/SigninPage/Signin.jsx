import React from "react";
import "./sign.css";
import { Link } from "react-router-dom";

const Signin = () => {
    return (

        <div className="signin-container">
            <div className="signin-header">
                <img src="./../../public/Images/Logo(Nav).png" alt="" />
                <Link to="/home-page" className="go-to-home">Homiee</Link>
            </div>
            <div className="signin-login-box">
                <h2>Log in</h2>
                <form>
                    <div className="signin-input-group">
                        <label htmlFor="email">E-MAIL</label>
                        <input type="email" id="email" placeholder="E-MAIL" />
                    </div>
                    <div className="signin-input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" placeholder="Password" />
                    </div>
                    <div className="signin-links">
                        <Link to="/sign-up">Not a member? Get started</Link>
                    </div>
                    <button className="signin-login-btn">Log in</button>
                    <div className="signin-google-btn">
                        <img src="./../../public/google-search 1.png" />
                        Log in with Google
                    </div>
                </form>
            </div>
        </div>

    );
};

export default Signin;
