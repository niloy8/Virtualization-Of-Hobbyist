import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./CommunityPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHome,
    faPalette,
    faMusic,
    faGamepad,
    faChess,
    faTools,
    faComments
} from "@fortawesome/free-solid-svg-icons";

const CommunityPage = () => {
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userEmail = localStorage.getItem("email");

    // Map community names to icons
    const communityIcons = {
        "Painting": faPalette,
        "Musical Instruments": faMusic,
        "Gaming": faGamepad,
        "Chess": faChess,
        "DIY Crafting": faTools
    };

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                const response = await fetch(`http://localhost:5000/users/${userEmail}/communities`);
                if (!response.ok) {
                    throw new Error("Failed to fetch communities");
                }
                const data = await response.json();
                setCommunities(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching communities:", error);
                setLoading(false);
            }
        };

        if (userEmail) {
            fetchCommunities();
        }
    }, [userEmail]);

    const handleCommunityClick = (communityName) => {
        navigate(`chat/${communityName}`);
    };

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
                    <div className="community-title">Your Communities</div>

                    {loading ? (
                        <div>Loading communities...</div>
                    ) : communities.length === 0 ? (
                        <div>No communities found. Update your hobbies to join communities.</div>
                    ) : (
                        communities.map((community) => (
                            <div
                                key={community.name}
                                className="community-item"
                                onClick={() => handleCommunityClick(community.name)}
                            >
                                <FontAwesomeIcon
                                    icon={communityIcons[community.name] || faComments}
                                    className="community-icon"
                                    size="2x"
                                />
                                <div className="community-name">{community.name}</div>
                                <NavLink
                                    to={`chat/${community.name}`}
                                    className="navlink-chat"
                                >
                                    Chat
                                </NavLink>
                            </div>
                        ))
                    )}
                </div>

                {/* Main Content */}
                <div className="community-main">
                    <Outlet /> {/* This will render the nested route content */}
                </div>
            </div>
        </div>
    );
};

export default CommunityPage;