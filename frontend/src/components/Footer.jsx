import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Footer() {
    const navigate = useNavigate();

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/logout", {
                method: "POST",
                credentials: "include",
            });
            if (res.ok) {
                navigate("/login");
            } else {
                console.error("Logout failed:", res.status);
                alert("La déconnexion a échoué. Veuillez réessayer.");
            }
        } catch (err) {
            console.error("Logout error:", err);
            alert("Erreur réseau lors de la déconnexion.");
        }
    };

    const footerStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "1.5rem",
        padding: "1rem",
        borderTop: "1px solid #ccc",
        fontFamily: "Arial, sans-serif",
        fontSize: "0.9rem",
        color: "#666",
    };

    const linkStyle = {
        textDecoration: "none",
        color: "#4B6000",
        fontWeight: "bold",
    };

    const buttonStyle = {
        backgroundColor: "transparent",
        color: "#4B6000",
        border: "1px solid #4B6000",
        padding: "0.4rem 0.8rem",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
    };

    return (
        <footer style={footerStyle}>
            <span>© All rights reserved</span>
            <Link to="/terms" style={linkStyle}>
                Terms of Service
            </Link>
            <button onClick={handleLogout} style={buttonStyle}>
                Logout
            </button>
        </footer>
    );
}