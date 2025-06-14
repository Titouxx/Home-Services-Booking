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
            .then(async (r) => {
                if (r.ok) {
                    const user = await r.json();
                    if (user.status === "prestataire") {
                        navigate("/provider-dashboard");
                    } else {
                        navigate("/");
                    }
                }
            })
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
                // Récupère l'utilisateur connecté et stocke-le
                const meResp = await fetch("/api/auth/me", { credentials: "include" });
                if (meResp.ok) {
                    const user = await meResp.json();
                    localStorage.setItem("user", JSON.stringify(user));
                    if (user.status === "prestataire") {
                        navigate("/provider-dashboard");
                    } else {
                        navigate("/");
                    }
                }
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
                <h2 className="auth-title">Connexion</h2>
                <form onSubmit={handleLogin} className="auth-form">
                    <input
                        className="auth-input"
                        type="text"
                        placeholder="Nom d'utilisateur"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        className="auth-input"
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button className="auth-button" type="submit">
                        Se connecter
                    </button>
                </form>
                <p className="auth-switch">
                    Pas encore inscrit ?{" "}
                    <span className="auth-link" onClick={() => navigate("/register")}>
            Créez un compte
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