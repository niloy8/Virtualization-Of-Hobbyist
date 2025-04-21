/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import "./ProfilePage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";

const ProfilePage = () => {
    const [profileImage, setProfileImage] = useState("https://placehold.co/50x50");
    const [description, setDescription] = useState("Click to add description");
    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [postContent, setPostContent] = useState("");
    const [caption, setCaption] = useState("");
    const [media, setMedia] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState({});
    const [comments, setComments] = useState({});  // State to store comments for each post
    const [shares, setShares] = useState({});  // State to store share count for each post
    const [showComments, setShowComments] = useState({}); // Track which post comments are visible
    const fileInputRef = useRef();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDescriptionClick = () => setIsEditingDesc(true);
    const handleDescriptionChange = (e) => setDescription(e.target.value);
    const handleDescriptionBlur = () => setIsEditingDesc(false);

    const handleFileUpload = (e) => setMedia(e.target.files[0]);

    const handlePostSubmit = () => {
        const newPost = {
            id: Date.now(),
            caption,
            text: postContent,
            media: media ? URL.createObjectURL(media) : null,
            mediaType: media?.type,
        };
        setUserPosts([newPost, ...userPosts]);
        setPostContent("");
        setCaption("");
        setMedia(null);
        setShowModal(false);
    };

    const toggleLike = (id) => {
        setLikedPosts((prevLikes) => ({
            ...prevLikes,
            [id]: !prevLikes[id],
        }));
    };

    const addComment = (postId, comment) => {
        setComments((prevComments) => {
            const postComments = prevComments[postId] || [];
            return {
                ...prevComments,
                [postId]: [...postComments, comment],
            };
        });
    };

    const handleCommentSubmit = (postId, commentText) => {
        if (commentText.trim() !== "") {
            addComment(postId, commentText);
        }
    };

    const toggleCommentsVisibility = (postId) => {
        setShowComments((prevState) => ({
            ...prevState,
            [postId]: !prevState[postId],
        }));
    };

    const sharePost = (postId) => {
        const postLink = `https://yourapp.com/post/${postId}`;
        prompt("Copy the post link:", postLink);  // Allows the user to copy the post link
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <img
                    src={profileImage}
                    alt="Profile"
                    className="profile-picture"
                    onClick={() => fileInputRef.current.click()}
                />
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                />
                <div>
                    <h1 className="profile-name">Name</h1>
                    {isEditingDesc ? (
                        <input
                            value={description}
                            onChange={handleDescriptionChange}
                            onBlur={handleDescriptionBlur}
                            autoFocus
                            className="input-box"
                        />
                    ) : (
                        <p
                            className="profile-description"
                            onClick={handleDescriptionClick}
                        >
                            {description}
                        </p>
                    )}
                </div>
                <div className="profile-action">
                    <NavLink to="/community-page/journal">
                        <FontAwesomeIcon icon={faPlusCircle} className="icon-plus" />
                    </NavLink>
                    <p>Create Journal</p>
                </div>
            </div>

            <div className="profile-tags">
                <span className="tag">Places</span>
                <span className="tag">Video editing</span>
                <span className="tag">DIY crafting</span>
                <span className="tag">Yoga</span>
            </div>

            <div className="profile-thoughts">
                <div className="thoughts-input" onClick={() => setShowModal(true)}>
                    <input
                        type="text"
                        placeholder="Share Your thoughts.."
                        className="input-box"
                        readOnly
                    />
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <textarea
                            placeholder="What's on your mind?"
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                            rows={4}
                        />
                        <input
                            type="text"
                            placeholder="Add a caption (optional)"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                        />
                        <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileUpload}
                        />
                        <div className="modal-buttons">
                            <button className="cancel" onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                            <button className="post" onClick={handlePostSubmit}>
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="feed-container">
                <div className="post-feed">
                    {userPosts.length === 0 ? (
                        <p className="no-posts">No posts yet.</p>
                    ) : (
                        userPosts.map((post) => (
                            <div key={post.id} className="post-card">
                                {post.media && post.mediaType?.startsWith("image") && (
                                    <img src={post.media} alt="post" className="post-media" />
                                )}
                                {post.media && post.mediaType?.startsWith("video") && (
                                    <video controls className="post-media">
                                        <source src={post.media} />
                                    </video>
                                )}
                                <p className="post-caption">{post.caption}</p>
                                <p className="post-text">{post.text}</p>

                                <div className="post-actions">
                                    <button
                                        className={`like-button ${likedPosts[post.id] ? "liked" : ""}`}
                                        onClick={() => toggleLike(post.id)}
                                    >
                                        <i className="fas fa-heart"></i> Like
                                    </button>
                                    <button
                                        className="comment-button"
                                        onClick={() => toggleCommentsVisibility(post.id)}
                                    >
                                        <i className="fas fa-comment"></i> Comment
                                    </button>
                                    <button className="share-button" onClick={() => sharePost(post.id)}>
                                        <i className="fas fa-share"></i> Share
                                    </button>
                                </div>

                                {/* Comments Section */}
                                {showComments[post.id] && (
                                    <div className="comments-section">
                                        {comments[post.id] && comments[post.id].map((comment, index) => (
                                            <div key={index} className="comment">
                                                <span className="comment-author">User</span>: <span className="comment-text">{comment}</span>
                                            </div>
                                        ))}
                                        <div className="comment-input-container">
                                            <input
                                                id={`comment-input-${post.id}`}
                                                type="text"
                                                placeholder="Write a comment..."
                                                className="comment-input"
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        handleCommentSubmit(post.id, e.target.value);
                                                        e.target.value = "";
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Display share count */}
                                {shares[post.id] > 0 && (
                                    <p className="share-count">{shares[post.id]} Shares</p>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
