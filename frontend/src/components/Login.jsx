import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // 🔒 Redirection si déjà connecté
    useEffect(() => {
        fetch("http://localhost:8080/api/auth/me", {
            credentials: "include",
        })
            .then((res) => {
                if (res.ok) {
                    navigate("/"); // redirection si connecté
                }
            })
            .catch(() => {});
    }, []);

    const handleLogin = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                navigate("/");
            } else {
                alert("Identifiants invalides");
            }
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h2>Connexion</h2>
            <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <br />
            <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button onClick={handleLogin}>Se connecter</button>
            <br /><br />
            <button onClick={() => navigate("/register")}>S'inscrire</button>
        </div>
    );
};

export default Login;
