import React from "react";
import "./ProfilePage.css"; // Import the separate CSS file
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faImage } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";

const ProfilePage = () => {
    return (
        <div className="profile-container">
            {/* Profile Section */}
            <div className="profile-header">
                <img
                    src="https://placehold.co/50x50"
                    alt="Profile"
                    className="profile-picture"
                />
                <div>
                    <h1 className="profile-name">Name</h1>
                    <p className="profile-description">Description</p>
                </div>
                <div className="profile-action">
                    <NavLink to='/community-page/journal'><FontAwesomeIcon icon={faPlusCircle} className="icon-plus" /></NavLink><p>Create Journal</p>
                </div>
            </div>

            {/* Tags Section */}
            <div className="profile-tags">
                <span className="tag">Places</span>
                <span className="tag">Video editing</span>
                <span className="tag">DIY crafting</span>
                <span className="tag">Yoga</span>
            </div>

            {/* Share Thoughts Section */}
            <div className="profile-thoughts">
                <div className="thoughts-input">
                    <input
                        type="text"
                        placeholder="Share Your thoughts.."
                        className="input-box"
                    />
                </div>
                <div className="upload-box">
                    <FontAwesomeIcon icon={faImage} className="icon-image" />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
