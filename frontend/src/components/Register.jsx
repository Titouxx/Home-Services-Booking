import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";  // ← on importe Link
import Header from "./Header";
import "../styles/Auth.css";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("client");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const resp = await fetch("/api/auth/register", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, status }),
            });
            if (resp.ok) {
                navigate("/login");
            } else {
                const text = await resp.text();
                alert(`Erreur : ${text}`);
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
                <h2 className="auth-title">Register</h2>
                <form onSubmit={handleRegister} className="auth-form">
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
                    <select
                        className="auth-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    >
                        <option value="client">Client</option>
                        <option value="prestataire">Provider</option>
                    </select>
                    <button className="auth-button" type="submit">
                        Sign up
                    </button>
                </form>
                <p className="auth-switch">
                    Already registered ?{" "}
                    <span className="auth-link" onClick={() => navigate("/login")}>
            Log in
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