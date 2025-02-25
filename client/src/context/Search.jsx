import { createContext, useContext, useState} from "react";

// Create AuthContext
const SearchContext = createContext();

// AuthProvider Component
const SearchProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        keyword: "",
        result: []
    });


    return (
        <SearchContext.Provider value={[auth, setAuth]}>
            {children}
        </SearchContext.Provider>
    );
};

// Custom Hook for easy use
const useSearch = () => useContext(SearchContext);

export { useSearch, SearchProvider };
