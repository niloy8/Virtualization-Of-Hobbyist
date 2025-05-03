import { useState } from "react";
import "./ProductCart.css";
import { NavLink } from "react-router-dom";

const ProductCart = () => {
    const [products, setProducts] = useState([
        { id: 1, name: "Product Name", price: 50, quantity: 1 },
        { id: 2, name: "Product Name", price: 100, quantity: 1 },
    ]);

    const handleQuantityChange = (id, amount) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id === id
                    ? { ...product, quantity: Math.max(1, product.quantity + amount) }
                    : product
            )
        );
    };

    const removeProduct = (id) => {
        setProducts(products.filter((product) => product.id !== id));
    };

    const totalPrice = products.reduce(
        (total, product) => total + product.price * product.quantity,
        0
    );

    return (
        <div className="bg-black text-white flex flex-col items-center justify-center min-h-screen">
            <div className="text-center mb-8">
                <h1 className="text-xl font-bold">PRODUCT CART</h1>
                <div className="bg-gray-300 text-black px-4 py-2 mt-2 inline-block rounded total-price">
                    Total Price - ${totalPrice}
                </div>
            </div>

            <div className="product-cart-list">
                {products.map((product) => (
                    <div key={product.id} className="product-item">
                        <img
                            src="https://storage.googleapis.com/a1aa/image/0ftaSvW7Ugi9bLresA4MJgemF3fGcpCAlpZ48ARkI-I.jpg"
                            alt="Product"
                            className="w-12 h-12"
                        />
                        <div className="flex-1">
                            <div>{product.name}</div>
                            <div>${product.price}</div>
                        </div>
                        <button className="remove-btn" onClick={() => removeProduct(product.id)}>
                            Remove Product
                        </button>
                        <div className="flex items-center space-x-2 product-quantity">
                            <button className="quantity-btn" onClick={() => handleQuantityChange(product.id, 1)}>+</button>
                            <span>{product.quantity}</span>
                            <button className="quantity-btn" onClick={() => handleQuantityChange(product.id, -1)}>-</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <NavLink to='/community-page/placeorder'><button className="checkout-btn">CheckOut</button></NavLink>
            </div>

            <div className="chat-icon">
                <i className="fas fa-comment-dots text-3xl text-white"></i>
            </div>
        </div>
    );
};

export default ProductCart;
