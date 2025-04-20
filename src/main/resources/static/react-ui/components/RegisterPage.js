import React from "react";
import { Link } from "react-router-dom";

const RegisterPage = () => {
    return (
        <div>
            <h2>Inscription</h2>
            <form>
                <input type="text" placeholder="Nom" /><br />
                <input type="email" placeholder="Email" /><br />
                <input type="password" placeholder="Mot de passe" /><br />
                <button type="submit">Créer un compte</button>
            </form>
            <p><Link to="/login">Déjà inscrit ?</Link></p>
            <p><Link to="/">Accueil</Link></p>
        </div>
    );
};

export default RegisterPage;
