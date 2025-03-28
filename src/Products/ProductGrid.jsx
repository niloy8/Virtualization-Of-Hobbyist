import React from "react";
import "./ProductGrid.css";
import { NavLink } from "react-router-dom";

const products = [
    {
        id: 1,
        name: "Product Name",
        image:
            "https://storage.googleapis.com/a1aa/image/6PQ10RjAALvr361JcmgMPi7S8VpqD0sZva-frJKc3H8.jpg",
    },
    {
        id: 2,
        name: "Product Name",
        image: "https://storage.googleapis.com/a1aa/image/6PQ10RjAALvr361JcmgMPi7S8VpqD0sZva-frJKc3H8.jpg",
    },
    {
        id: 3,
        name: "Product Name",
        image: "https://storage.googleapis.com/a1aa/image/6PQ10RjAALvr361JcmgMPi7S8VpqD0sZva-frJKc3H8.jpg",
    },
    {
        id: 4,
        name: "Product Name",
        image: "https://storage.googleapis.com/a1aa/image/6PQ10RjAALvr361JcmgMPi7S8VpqD0sZva-frJKc3H8.jpg",
    },
];

const ProductGrid = () => {
    return (
        <div className="product-page-container">
            <div className="product-page-grid">
                {products.map((product) => (
                    <div key={product.id} className="product-page-card">
                        <img
                            src={product.image}
                            alt={product.name}
                            width="100"
                            height="100"
                            className="product-page-image"
                        />
                        <NavLink to='/community-page/productdetail' className='product-nav'>
                            <p className="product-page-text">{product.name}</p>
                        </NavLink>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductGrid;
