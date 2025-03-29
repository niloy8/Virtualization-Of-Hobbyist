import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./CommunityPage.css"; // Import the CSS file
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

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
                    <NavLink to='/community-page/allposts'><FontAwesomeIcon icon={faHome} className="community-icon" /></NavLink>
                    <NavLink to="profile">
                        <img src="../../public/Images/🦆 icon _User Circle_.png" alt="" />
                    </NavLink>
                    <NavLink to='/community-page/specificpost'><img src="../../public/Images/JustSpecific.png" alt="" /></NavLink>
                </div>
                <div className="community-nav-right-notification">
                    <NavLink to="products"><img src="../../public/Images/Marketplace.png" alt="" /></NavLink>
                    <img src="../../public/Images/🦆 icon _bell_.png" alt="" />
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
