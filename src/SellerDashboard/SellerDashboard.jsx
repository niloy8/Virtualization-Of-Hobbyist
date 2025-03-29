import React, { useState } from "react";
import "./SellerDashboard.css";

const SellerDashboard = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const images = [
        "https://storage.googleapis.com/a1aa/image/_ga7RV-JKhbVEm58L07VMydur2ukCsy9E4gPdnJd-IE.jpg",
        "https://storage.googleapis.com/a1aa/image/65TXye74tJhBAQvMsIOFBuQHFSjmm3uLeYCu_EeMgjU.jpg",
        "https://storage.googleapis.com/a1aa/image/Zu6NUAmT4S3q-F8YvFoT6rC6j3ZQI6qQkm8nYBIUJak.jpg",
    ];

    const moveSlide = (direction) => {
        const totalSlides = images.length;
        setCurrentSlide((prev) => (prev + direction + totalSlides) % totalSlides);
    };

    return (
        <div className="seller-dashboard bg-gray-800 text-white p-4">
            <div className="dashboard-container">
                <div className="form-section">
                    <h1 className="text-xl font-bold mb-4">Seller Dashboard</h1>
                    <div className="input-group">
                        <label>Product Name</label>
                        <input type="text" className="input-field" />
                    </div>
                    <div className="input-group">
                        <label>Price</label>
                        <input type="text" className="input-field" />
                    </div>
                    <div className="input-group">
                        <label>Description</label>
                        <textarea rows='5' className="input-field" />
                    </div>
                    <button className="btn-primary">Add Image</button>
                    <button className="btn-primary btn-add-product">Add Product</button>
                </div>

                <div className="image-preview">
                    <div className="slider">
                        <div className="slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                            {images.map((src, index) => (
                                <div className="slide" key={index}>
                                    <img src={src} alt={`Slide ${index + 1}`} className="slide-image" />
                                </div>
                            ))}
                        </div>
                        <button className="prev" onClick={() => moveSlide(-1)}>❮</button>
                        <button className="next" onClick={() => moveSlide(1)}>❯</button>
                    </div>
                </div>
            </div>

            <div className="product-list">
                <div className="search-bar">
                    <input type="text" className="input-field" placeholder="Search" />
                    <button className="btn-secondary">Search</button>
                </div>

                <div className="product-item">
                    <img
                        src="https://storage.googleapis.com/a1aa/image/WIIrRK-Z8TWtUtoSjhTUT0gKGLI7fgd7cbbpS8561gc.jpg"
                        alt="Product"
                        className="product-image"
                    />
                    <div className="product-details">
                        <div className="font-bold">Product Name</div>
                        <div>Price</div>
                    </div>
                    <button className="btn-primary btn-remove-product">Remove Product</button>
                </div>
            </div>

            <div className="chat-button">
                <button className="chat-icon">
                    <i className="fas fa-comment"></i>
                </button>
            </div>
        </div>
    );
};

export default SellerDashboard;
