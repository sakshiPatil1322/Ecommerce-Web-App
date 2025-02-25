import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import UserMenu from '../../components/Layout/UserMenu';
import { useAuth } from '../../context/auth';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [auth] = useAuth();

    useEffect(() => {
        if (auth?.token) {
            const storedOrders = JSON.parse(localStorage.getItem(`orders_${auth.user._id}`)) || [];
            setOrders(storedOrders);
        }
    }, [auth]);

    return (
        <Layout title={"Your Orders"}>
            <div className="container-fluid p-3 m-3">
                <div className="row">
                    <div className="col-md-3">
                        <UserMenu />
                    </div>
                    <div className="col-md-9 pe-5">
                        <h1>Your Orders</h1>
                        {orders.length === 0 ? (
                            <p>No orders placed yet.</p>
                        ) : (
                            orders.map((order, index) => (
                                <div key={order.orderId} className="card mb-3">
                                    <div className="card-header">
                                        <h5>Order #{index + 1} - Total: Rs {order.total}</h5>
                                    </div>
                                    <div className="card-body">
                                        {order.items.map((item) => (
                                            <div key={item._id} className="d-flex align-items-center mb-2">
                                                <img src={`${import.meta.env.VITE_API_BASE_URL}/api/v1/product/product-photo/${item._id}`}
                                                    alt={item.name} width="50" className="me-3" />
                                                <span>{item.name} - Rs {item.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Orders;
