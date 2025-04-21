import React, { useState } from "react";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:5000/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            alert("Signup Successful! You can now log in.");
            navigate("/sign-in");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h2 className="signup-title">Sign Up</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="signup-input-group">
                        <input className="signup-input" type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
                        <input className="signup-input" type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
                    </div>
                    <input className="signup-input full-input" type="text" name="userName" placeholder="User Name" onChange={handleChange} required />
                    <input className="signup-input full-input" type="email" name="email" placeholder="Email" onChange={handleChange} required />
                    <input className="signup-input full-input" type="password" name="password" placeholder="Password" onChange={handleChange} required />
                    <button className="signup-btn" type="submit">Sign Up</button>
                </form>
                <p className="signup-footer">Already have an account? <Link className="signup-login-link" to="/sign-in">Log in</Link></p>
            </div>
        </div>
    );
};

export default Signup;
