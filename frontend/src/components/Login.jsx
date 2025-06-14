// src/components/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";  // ← on importe Link
import Header from "./Header";
import "../styles/Auth.css";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/api/auth/me", { credentials: "include" })
            .then((r) => r.ok && navigate("/"))
            .catch(() => {});
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const resp = await fetch("/api/auth/login", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            if (resp.ok) {
                navigate("/");
            } else {
                alert("Identifiants invalides");
            }
        } catch (err) {
            console.error(err);
            alert("Erreur réseau, réessayez");
        }
    };

    return (
        <div className="auth-page">
            <Header />
            <div className="auth-container">
                <h2 className="auth-title">Log In</h2>
                <form onSubmit={handleLogin} className="auth-form">
                    <input
                        className="auth-input"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        className="auth-input"
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button className="auth-button" type="submit">
                        Se connecter
                    </button>
                </form>
                <p className="auth-switch">
                    Not registered yet ?{" "}
                    <span className="auth-link" onClick={() => navigate("/register")}>
            Register
          </span>
                </p>
                {/* --- nouveau lien Terms en bas --- */}
                <p className="auth-terms">
                    <Link to="/terms">Terms of Service</Link>
                </p>
            </div>
        </div>
    );
}