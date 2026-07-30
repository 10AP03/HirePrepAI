import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [token, setToken] = useState(
        localStorage.getItem("token") || null
    );

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const storedUser = localStorage.getItem("user");

        if (storedUser) {   
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);

    }, []);

    // Login Function

    const login = (userData, jwtToken) => {

        localStorage.setItem("user", JSON.stringify(userData));

        localStorage.setItem("token", jwtToken);

        setUser(userData);

        setToken(jwtToken);

    };

    // Logout Function

    const logout = () => {

        localStorage.removeItem("user");

        localStorage.removeItem("token");

        setUser(null);

        setToken(null);

    };

    const value = {

        user,
        token,
        loading,

        login,
        logout,

        setUser,
        setToken,

    };

    return (

        <AuthContext.Provider value={value}>

            {children}

        </AuthContext.Provider>

    );

};

export const useAuth = () => {

    return useContext(AuthContext);

};