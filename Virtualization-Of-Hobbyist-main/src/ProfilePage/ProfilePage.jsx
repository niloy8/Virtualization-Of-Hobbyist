/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
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
    const [comments, setComments] = useState({});
    const [shares, setShares] = useState({});
    const [showComments, setShowComments] = useState({});
    const [selectedTopic, setSelectedTopic] = useState("");
    const [searchTopic, setSearchTopic] = useState("");
    const [userName, setUserName] = useState("");
    const [userHobbies, setUserHobbies] = useState([]);


    const fileInputRef = useRef();

    const hobbies = [
        "DIY Crafting", "Yoga", "Traveling", "Photography", "Gaming",
        "Music", "Painting", "Fitness", "Cooking", "Blogging",
        "Personal"
    ];

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const response = await fetch("http://localhost:5000/users", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setUserName(data.name || "Unnamed User"); // assuming 'name' is a field in your user object
                    setUserHobbies(data.hobbies || []); // assuming 'hobbies' is an array
                } else {
                    console.error("Failed to fetch user data:", data.error);
                }
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };

        fetchUserData();
    }, []);


    const filteredHobbies = hobbies.filter((hobby) =>
        hobby.toLowerCase().includes(searchTopic.toLowerCase())
    );

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
        if (!selectedTopic) {
            alert("Please select a topic before posting.");
            return;
        }

        const newPost = {
            id: Date.now(),
            caption,
            text: postContent,
            media: media ? URL.createObjectURL(media) : null,
            mediaType: media?.type,
            topic: selectedTopic,
        };
        setUserPosts([newPost, ...userPosts]);
        setPostContent("");
        setCaption("");
        setMedia(null);
        setSelectedTopic("");
        setSearchTopic("");
        setShowModal(false);
    };

    const toggleLike = (id) => {
        setLikedPosts((prevLikes) => {
            const newLikes = { ...prevLikes };
            if (newLikes[id]) {
                newLikes[id] = false;
            } else {
                newLikes[id] = true;
            }
            return newLikes;
        });
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
        prompt("Copy the post link:", postLink);
        setShares((prevShares) => ({
            ...prevShares,
            [postId]: (prevShares[postId] || 0) + 1,
        }));
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
                    <h1 className="profile-name">{userName}</h1>

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
                {userHobbies.length > 0 ? (
                    userHobbies.map((hobby, index) => (
                        <span key={index} className="tag">{hobby}</span>
                    ))
                ) : (
                    <span className="tag">No hobbies selected</span>
                )}
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

                        {/* Topic selection */}
                        <div className="topic-selector">
                            <input
                                type="text"
                                placeholder="Search or select a topic..."
                                value={searchTopic}
                                onChange={(e) => setSearchTopic(e.target.value)}
                                className="input-box"
                            />
                            <div className="topic-list">
                                {filteredHobbies.length > 0 ? (
                                    filteredHobbies.map((hobby, index) => (
                                        <div
                                            key={index}
                                            className={`topic-item ${selectedTopic === hobby ? "selected" : ""}`}
                                            onClick={() => setSelectedTopic(hobby)}
                                        >
                                            {hobby}
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-topics">No topics found.</div>
                                )}
                            </div>
                        </div>

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
                                <p className="post-topic">#{post.topic}</p>
                                <p className="post-caption">{post.caption}</p>
                                <p className="post-text">{post.text}</p>

                                <div className="post-actions">
                                    <button
                                        className={`like-button ${likedPosts[post.id] ? "liked" : ""}`}
                                        onClick={() => toggleLike(post.id)}
                                    >
                                        <i className="fas fa-heart"></i> Like ({likedPosts[post.id] ? 1 : 0})
                                    </button>
                                    <button
                                        className="comment-button"
                                        onClick={() => toggleCommentsVisibility(post.id)}
                                    >
                                        <i className="fas fa-comment"></i> Comment ({comments[post.id]?.length || 0})
                                    </button>
                                    <button
                                        className="share-button"
                                        onClick={() => sharePost(post.id)}
                                    >
                                        <i className="fas fa-share"></i> Share ({shares[post.id] || 0})
                                    </button>
                                </div>

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
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
