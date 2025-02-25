import React from "react";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CartPage = () => {
    const [cart, setCart] = useCart();
    const [auth] = useAuth();
    const navigate = useNavigate();

    // Calculate Total Price
    const totalPrice = () => {
        return cart.reduce((total, item) => total + item.price, 0);
    };

    // Remove item from cart
    const removeCartItem = (pid) => {
        let updatedCart = cart.filter(item => item._id !== pid);
        setCart(updatedCart);
    };
    

    // Handle Payment with Stripe Checkout
    const handleCheckout = async () => {
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/payment/create-checkout-session`, { cart });
    
            // Redirect to Stripe Checkout
            window.location.href = data.url;
    
            // Store the order in localStorage
            if (auth?.token) {
                let orders = JSON.parse(localStorage.getItem(`orders_${auth.user._id}`)) || [];
                orders.push({ orderId: Date.now(), items: cart, total: totalPrice() }); // Unique order ID
                localStorage.setItem(`orders_${auth.user._id}`, JSON.stringify(orders));
                setCart([]); // Clear cart after checkout
                localStorage.removeItem(`cart_${auth.user._id}`);
            }
        } catch (error) {
            console.error("Checkout Error:", error);
        }
    };
    

    return (
        <Layout>
            <div className="container">
                {/* Heading Section */}
                <div className="row">
                    <div className="col-md-12">
                        <h1 className="text-center bg-light p-2 mb-1">
                            {`Hello ${auth?.token ? auth?.user?.name : "Guest"} `}
                        </h1>
                        <h4 className="text-center">
                            {cart?.length
                                ? `You have ${cart.length} items in your cart. ${auth?.token ? "" : "Please login to checkout."}`
                                : "Your cart is empty."}
                        </h4>
                    </div>
                </div>

                {/* Cart and Summary Section */}
                <div className="row d-flex justify-content-between">
                    {/* Cart Items Section */}
                    <div className="col-md-9">
                        <div className="d-flex flex-wrap">
                            {cart.map((p) => (
                                <div className="card m-2 product-card" key={p._id}>
                                    <div className="image-container">
                                        <img
                                            src={`${import.meta.env.VITE_API_BASE_URL}/api/v1/product/product-photo/${p._id}`}
                                            className="product-image"
                                            alt={p.name}
                                        />
                                    </div>
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h5 className="card-title text-purple">{p.name}</h5>
                                            <p className="text-orange price-tag">Rs {p.price}</p>
                                        </div>
                                        <div className="description-box">
                                            <p className="card-text">{p.description.substring(0, 30)}...</p>
                                        </div>
                                        <div className="button-group">
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => removeCartItem(p._id)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cart Summary (Checkout Section) */}
                    <div className="col-md-3">
                        <div className="summary-box p-3 border rounded">
                            <h2 className="text-center">Cart Summary</h2>
                            <p className="text-center">Total | Checkout | Payment</p>
                            <hr />
                            <h3 className="text-center">Total: Rs. {totalPrice()}</h3>

                            {/* Address Check */}
                            {auth?.token ? (
                                auth?.user?.address ? (
                                    <div className="mb-3 text-center">
                                        <h4>Current Address</h4>
                                        <h5>{auth.user.address}</h5>
                                        <button
                                            className="btn btn-outline-warning w-100"
                                            onClick={() => navigate("/dashboard/user/profile")}
                                        >
                                            Update Address
                                        </button>
                                    </div>
                                ) : (
                                    <div className="mb-3">
                                        <button
                                            className="btn btn-outline-warning w-100"
                                            onClick={() => navigate("/dashboard/user/profile")}
                                        >
                                            Add Address to Proceed
                                        </button>
                                    </div>
                                )
                            ) : (
                                <div className="mb-3">
                                    <button
                                        className="btn btn-outline-warning w-100"
                                        onClick={() => navigate("/login", { state: "/cart" })}
                                    >
                                        Please Login to Checkout
                                    </button>
                                </div>
                            )}

                            {/* Stripe Checkout Button */}
                            {cart.length > 0 && auth?.token && auth?.user?.address && (
                                <button className="btn btn-success w-100 mt-3" onClick={handleCheckout}>
                                    Proceed to Payment
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>

    );
};

export default CartPage;
