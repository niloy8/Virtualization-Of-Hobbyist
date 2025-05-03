import { useState } from "react";
import "./PostFeed.css";

const posts = [
    { id: 1, type: "image", content: "All posts at one place" },
    { id: 2, type: "image", content: "Another post at one place" },
    { id: 3, type: "video", content: "Video post at one place", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { id: 4, type: "image", content: "Yet another post at one place" },
];

const PostFeed = () => {
    const [likedPosts, setLikedPosts] = useState({});

    const toggleLike = (id) => {
        setLikedPosts((prevLikes) => ({
            ...prevLikes,
            [id]: !prevLikes[id],
        }));
    };

    return (
        <div className="feed-container">
            <div className="post-feed">
                {posts.map((post) => (
                    <div key={post.id} className="post-card">
                        {post.type === "image" ? (
                            <div className="image-placeholder">
                                <i className="fas fa-image"></i>
                            </div>
                        ) : (
                            <video className="video-post" controls>
                                <source src={post.videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        )}

                        <p className="post-text">{post.content}</p>

                        <div className="post-actions">
                            <button
                                className={`like-button ${likedPosts[post.id] ? "liked" : ""}`}
                                onClick={() => toggleLike(post.id)}
                            >
                                <i className="fas fa-heart"></i> H
                            </button>
                            <button className="comment-button">
                                <i className="fas fa-comment"></i> Comment
                            </button>
                            <button className="share-button">
                                <i className="fas fa-share"></i> Share
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostFeed;
