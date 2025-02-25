import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Spinner = ({ path = "login" }) => {
    const [count, setCount] = useState(3);
    const navigate = useNavigate();
    const location = useLocation();

    // Countdown Effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prevValue) => --prevValue);
        }, 1000);
        count === 0 && navigate(`/${path}`,{
            state:location.pathname,
        });

        return () => clearInterval(interval);
    }, [count, navigate, location, path]);

    return (
        <div className="spinner">
            <h1>Redirecting you in {count} sec</h1>
            <div className="spinner-border" role="status">
                <span className="sr-only"></span>
            </div>
        </div>
    );
};

export default Spinner;
