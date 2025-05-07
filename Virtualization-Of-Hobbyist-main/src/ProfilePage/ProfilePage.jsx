/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import "./ProfilePage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
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
    const [userHobbies, setUserHobbies] = useState([]);
    const [userName, setUserName] = useState("");

    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");
    const fileInputRef = useRef();

    const hobbies = [
        "DIY Crafting", "Yoga", "Traveling", "Photography", "Gaming",
        "Music", "Painting", "Fitness", "Cooking", "Blogging",
        "Personal"
    ];

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`http://localhost:5000/users/${email}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const data = await res.json();
                if (res.ok) {
                    setUserName(data.firstName);
                    setProfileImage(data.profileImage || "https://placehold.co/50x50");
                    setDescription(data.description || "Click to add description");
                    setUserHobbies(data.hobbies || []);

                    if (data.posts) {
                        const sortedPosts = [...data.posts].sort((a, b) =>
                            new Date(b.createdAt) - new Date(a.createdAt)
                        );
                        setUserPosts(sortedPosts);

                        const initialLikes = {};
                        const initialComments = {};
                        const initialShares = {};

                        sortedPosts.forEach(post => {
                            initialLikes[post.id] = post.likes || 0;
                            initialComments[post.id] = post.comments || [];
                            initialShares[post.id] = post.shares || 0;
                        });

                        setLikedPosts(initialLikes);
                        setComments(initialComments);
                        setShares(initialShares);
                    }
                }
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };

        if (email && token) {
            fetchUser();
        }
    }, [email, token]);

    const filteredHobbies = hobbies.filter((hobby) =>
        hobby.toLowerCase().includes(searchTopic.toLowerCase())
    );

    const updateProfile = async (newDescription, newImage) => {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("description", newDescription);
        if (newImage) formData.append("profileImage", newImage);

        try {
            const res = await fetch("http://localhost:5000/users", {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                setProfileImage(data.updated.profileImageUrl || profileImage);
                console.log("Profile updated successfully:", data);
            } else {
                console.error("Update failed:", data.error);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
                updateProfile(description, file);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDescriptionClick = () => setIsEditingDesc(true);
    const handleDescriptionChange = (e) => setDescription(e.target.value);
    const handleDescriptionBlur = () => {
        setIsEditingDesc(false);
        updateProfile(description, null);
    };

    const handleFileUpload = (e) => setMedia(e.target.files[0]);

    const handlePostSubmit = async () => {
        if (!selectedTopic) {
            alert("Please select a topic before posting.");
            return;
        }

        const newPost = {
            id: Date.now(),
            caption,
            text: postContent,
            mediaType: media?.type,
            topic: selectedTopic,
            likes: 0,
            comments: [],
            shares: 0,
            createdAt: new Date().toISOString()
        };

        try {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("post", JSON.stringify(newPost));
            if (media) {
                formData.append("media", media);
            }

            const res = await fetch("http://localhost:5000/users", {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                const responseData = await res.json();
                const savedPost = {
                    ...newPost,
                    media: responseData.updated.mediaUrl || null
                };

                setUserPosts(prev => [savedPost, ...prev]);
                setLikedPosts(prev => ({ ...prev, [savedPost.id]: false }));
                setComments(prev => ({ ...prev, [savedPost.id]: [] }));
                setShares(prev => ({ ...prev, [savedPost.id]: 0 }));

                setPostContent("");
                setCaption("");
                setMedia(null);
                setSelectedTopic("");
                setSearchTopic("");
                setShowModal(false);
            }
        } catch (err) {
            console.error("Error saving post:", err);
        }
    };

    const deletePost = async (postId) => {
        try {
            const res = await fetch(`http://localhost:5000/users/${email}/posts/${postId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                setUserPosts(prev => prev.filter(post => post.id !== parseInt(postId)));
            }
        } catch (err) {
            console.error("Error deleting post:", err);
        }
    };

    const toggleLike = async (id) => {
        const newLikedStatus = !likedPosts[id];
        setLikedPosts(prev => ({ ...prev, [id]: newLikedStatus }));

        try {
            await fetch("http://localhost:5000/users", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    email,
                    postId: id,
                    like: newLikedStatus
                })
            });
        } catch (err) {
            console.error("Error updating like:", err);
            // Revert if error
            setLikedPosts(prev => ({ ...prev, [id]: !newLikedStatus }));
        }
    };

    const addComment = async (postId, commentText) => {
        const comment = {
            id: Date.now(),
            user: userName,
            text: commentText,
            timestamp: new Date().toISOString()
        };

        const newComments = {
            ...comments,
            [postId]: [...(comments[postId] || []), comment]
        };
        setComments(newComments);

        try {
            await fetch("http://localhost:5000/users", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    email,
                    postId,
                    comment
                })
            });
        } catch (err) {
            console.error("Error saving comment:", err);
            // Revert if error
            setComments(prev => ({
                ...prev,
                [postId]: prev[postId].filter(c => c.id !== comment.id)
            }));
        }
    };

    const handleCommentSubmit = (postId, commentText) => {
        if (commentText.trim()) {
            addComment(postId, commentText);
        }
    };

    const toggleCommentsVisibility = (postId) => {
        setShowComments((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }));
    };

    const sharePost = (postId) => {
        const postLink = `${window.location.origin}/post/${postId}`;
        navigator.clipboard.writeText(postLink).then(() => {
            alert("Post link copied to clipboard!");
        }).catch(() => {
            prompt("Copy this link to share:", postLink);
        });

        setShares((prev) => ({
            ...prev,
            [postId]: (prev[postId] || 0) + 1,
        }));
    };
    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="image-preview-container">
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

                    <div className="fullscreen-overlay">
                        <img
                            src={profileImage}
                            alt="Profile Full"
                            className="fullscreen-image"
                            onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current.click();
                            }}
                        />
                    </div>
                </div>

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
                        <p className="profile-description" onClick={() => setIsEditingDesc(true)}>
                            {description}
                        </p>
                    )}
                </div>
                <NavLink to="/community-page/journal">
                    <FontAwesomeIcon icon={faPlusCircle} className="icon-plus" />
                </NavLink>
                <h5>Create Journal</h5>
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
                            <button className="cancel" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="post" onClick={handlePostSubmit}>Post</button>
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
                                <div className="post-header">
                                    <p className="post-topic">#{post.topic}</p>
                                    <button
                                        className="delete-post-button"
                                        onClick={() => deletePost(post.id)}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>

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
                                        <i className="fas fa-heart"></i> H ({likedPosts[post.id] ? 1 : 0})
                                    </button>
                                    <button
                                        className="comment-button"
                                        onClick={() => toggleCommentsVisibility(post.id)}
                                    >
                                        <i className="fas fa-comment"></i> Comment ({(comments[post.id] && comments[post.id].length) || 0})
                                    </button>
                                    <button
                                        className="share-button"
                                        onClick={() => sharePost(post.id)}
                                    >
                                        <i className="fas fa-share"></i> Share ({shares[post.id] || 0})
                                    </button>
                                </div>

                                {showComments[post.id] && (
                                    <div className="comment-section">
                                        <div className="comment-list">
                                            {comments[post.id] && comments[post.id].map((comment, index) => (
                                                <div key={index} className="comment">
                                                    <strong>{comment.user}</strong>: {comment.text}
                                                </div>
                                            ))}
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Add a comment..."
                                            className="input-box"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    handleCommentSubmit(post.id, e.target.value);
                                                    e.target.value = "";
                                                }
                                            }}
                                        />
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