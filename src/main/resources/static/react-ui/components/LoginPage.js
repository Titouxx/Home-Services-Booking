import React from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
    return (
        <div>
            <h2>Connexion</h2>
            <form>
                <input type="email" placeholder="Email" /><br />
                <input type="password" placeholder="Mot de passe" /><br />
                <button type="submit">Se connecter</button>
            </form>
            <p><Link to="/register">Pas encore inscrit ?</Link></p>
            <p><Link to="/">Accueil</Link></p>
        </div>
    );
};

export default LoginPage;
