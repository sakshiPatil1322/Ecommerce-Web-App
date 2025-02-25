import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create AuthContext
const AuthContext = createContext();

// AuthProvider Component
const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        token: ""
    });

    // default axios
    axios.defaults.headers.common['Authorization'] = auth?.token;

    // Load auth from localStorage when app starts
    useEffect(() => {
        const storedAuth = localStorage.getItem("auth");
        if (storedAuth) {
            setAuth(JSON.parse(storedAuth));
        }
    }, []);

    return (
        <AuthContext.Provider value={[auth, setAuth]}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook for easy use
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
