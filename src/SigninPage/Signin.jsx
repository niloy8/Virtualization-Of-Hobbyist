import React, { useState } from "react";
import "./sign.css";
import { Link, useNavigate } from "react-router-dom";

const Signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            alert("Login successful!");
            navigate("/hobby-selection");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="signin-container">
            <div className="signin-header">
                <img src="./../../public/Images/Logo(Nav).png" alt="logo" />
                <Link to="/home-page" className="go-to-home">Homiee</Link>
            </div>
            <div className="signin-login-box">
                <h2>Log in</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="signin-input-group">
                        <label htmlFor="email">E-MAIL</label>
                        <input type="email" id="email" placeholder="E-MAIL" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="signin-input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="signin-links">
                        <Link to="/sign-up">Not a member? Get started</Link>
                    </div>
                    <button className="signin-login-btn" type="submit">Log in</button>
                    <div className="signin-google-btn">
                        <img src="./../../public/google-search 1.png" alt="Google icon" />
                        Log in with Google
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signin;
