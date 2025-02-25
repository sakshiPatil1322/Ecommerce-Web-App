import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./auth"; // Import AuthContext

const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [auth] = useAuth(); // Get logged-in user info

    // Load Cart from LocalStorage for the Logged-in User
    useEffect(() => {
        if (auth?.token) {
            const storedCart = localStorage.getItem(`cart_${auth.user._id}`); // Unique cart per user
            setCart(storedCart ? JSON.parse(storedCart) : []);
        } else {
            setCart([]); // If user logs out, clear the cart
        }
    }, [auth]);

    // Save Cart to LocalStorage whenever it changes
    useEffect(() => {
        if (auth?.token) {
            localStorage.setItem(`cart_${auth.user._id}`, JSON.stringify(cart));
        }
    }, [cart, auth]);

    return (
        <CartContext.Provider value={[cart, setCart]}>
            {children}
        </CartContext.Provider>
    );
};

const useCart = () => useContext(CartContext);

export { useCart, CartProvider };
