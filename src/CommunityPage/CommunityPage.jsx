import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./CommunityPage.css"; // Import the CSS file
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUserCircle, faCog, faBell } from "@fortawesome/free-solid-svg-icons";

const CommunityPage = () => {
    return (
        <div className="community-container">
            {/* Top Navigation */}
            <div className="community-nav">
                <div className="community-nav-left">
                    <img src="./../../public/Images/Logo(Nav).png" className="community-icon" />
                    <input type="text" placeholder="Search" className="community-search" />
                </div>
                <div className="community-nav-right">
                    <FontAwesomeIcon icon={faHome} className="community-icon" />
                    <FontAwesomeIcon icon={faUserCircle} className="community-icon" />
                    <FontAwesomeIcon icon={faCog} className="community-icon" />
                    <FontAwesomeIcon icon={faBell} className="community-icon" />
                </div>
            </div>

            <div className="community-content">
                {/* Sidebar */}
                <div className="community-sidebar">
                    <div className="community-title">All Communities</div>
                    <div className="community-item">
                        <img
                            src="https://storage.googleapis.com/a1aa/image/UocDGuXiOx7MU_99dJOLhtZImNuu47mw4kEZ6xkJbqc.jpg"
                            alt="Community"
                            className="community-img"
                        />
                        <div className="community-name">Community 1</div>
                        {/* Add NavLink to the Chat route */}
                        <NavLink to="chat" className="navlink-chat">
                            Chat
                        </NavLink>
                    </div>
                    <div className="community-item">
                        <img
                            src="https://storage.googleapis.com/a1aa/image/UocDGuXiOx7MU_99dJOLhtZImNuu47mw4kEZ6xkJbqc.jpg"
                            alt="Community"
                            className="community-img"
                        />
                        <div className="community-name">Community 2</div>
                        {/* Add NavLink to the Chat route */}
                        <NavLink to="chat" className="navlink-chat">
                            Chat
                        </NavLink>
                    </div>
                </div>

                {/* Main Content (this will change based on the route) */}
                <div className="community-main">
                    <Outlet /> {/* This will render the nested route content, e.g., Chat */}
                </div>
            </div>
        </div>
    );
};

export default CommunityPage;
