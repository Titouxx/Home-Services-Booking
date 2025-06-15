import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const [authInfo, setAuthInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/auth/me", {
          credentials: "include",
        });
        if (response.ok) {
          const userData = await response.json();
          setAuthInfo({ ...userData, isAuthenticated: true });

          if (adminOnly && userData.status !== "administrateur") {
            navigate("/");
          } else if (!adminOnly && userData.status === "administrateur") {
            navigate("/admin");
          }
        } else {
          setAuthInfo({ isAuthenticated: false });
        }
      } catch (error) {
        console.error("Session check error:", error);
        setAuthInfo({ isAuthenticated: false });
      }
    };

    checkSession();
  }, [adminOnly, navigate]);

  if (authInfo === null) return <p>Loading...</p>;
  if (!authInfo?.isAuthenticated) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
