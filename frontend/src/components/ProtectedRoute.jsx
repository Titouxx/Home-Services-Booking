import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/auth/me", {
                    credentials: "include"
                });
                setIsAuthenticated(response.ok);
            } catch (error) {
                console.error("Erreur de vérification de session :", error);
                setIsAuthenticated(false);
            }
        };

        checkSession();
    }, []);

    if (isAuthenticated === null) return <p>Chargement...</p>;
    if (!isAuthenticated) return <Navigate to="/login" />;

    return children;
};

export default ProtectedRoute;
