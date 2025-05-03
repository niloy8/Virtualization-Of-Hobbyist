import "./Placeorder.css";

const Placeorder = () => {
    return (
        <div className="order-form-container">
            <div className="order-form-box">
                <div className="order-form-header">
                    <img
                        alt="Product image placeholder"
                        className="order-form-image"
                        src="https://placehold.co/100x100"
                    />
                    <div>
                        <h2 className="order-form-title">Product Name</h2>
                        <p className="order-form-description">Description</p>
                    </div>
                </div>
                <form>
                    <div className="order-form-grid">
                        <div className="order-form-row">
                            <input
                                className="order-form-input half"
                                placeholder="Full Name"
                                type="text"
                            />
                            <input
                                className="order-form-input half"
                                placeholder="Mobile"
                                type="text"
                            />
                        </div>
                        <input
                            className="order-form-input"
                            placeholder="E-mail"
                            type="email"
                        />
                        <input
                            className="order-form-input"
                            placeholder="Address"
                            type="text"
                        />
                    </div>
                    <button className="order-form-button" type="submit">
                        Place Order
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Placeorder
