/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./ProductDetail.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

const ProductDetail = () => {
    const images = [
        "https://storage.googleapis.com/a1aa/image/4AoFEHgssvEG38r1FB6KGjuXdCjFmI4Fe1Qqi2EEIqo.jpg",
        "https://placehold.co/200x200?text=Image+2",
        "https://placehold.co/200x200?text=Image+3"
    ];
    const [currentIndex, setCurrentIndex] = useState(0);

    const showImage = (index) => {
        setCurrentIndex(index);
    };

    const prevImage = () => {
        setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
    };

    const nextImage = () => {
        setCurrentIndex(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
    };

    return (
        <div className="product-slider-container">
            <div className="product-slider-card">
                <div className="product-slider-image-container">
                    <img
                        id="slider"
                        alt="Product Image"
                        className="product-slider-image magnify-image"
                        src={images[currentIndex]}
                    />
                    <button onClick={prevImage} className="product-slider-button-left">
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    <button onClick={nextImage} className="product-slider-button-right">
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>
                <div className="product-slider-description">
                    <p className="product-slider-name">Product Name</p>
                    <p className="product-slider-text">Description</p>
                </div>
                <div className="product-slider-actions">
                    <button className="product-slider-action-button">Check Out</button>
                    <button className="product-slider-action-button">Add To Cart</button>
                    <FontAwesomeIcon icon={faCartShopping} className="product-slider-cart-icon" />

                </div>
            </div>

        </div>
    );
};

export default ProductDetail;
