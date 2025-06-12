// src/components/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus]     = useState('client');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, status })
            });

            if (response.ok) {
                alert('Inscription réussie !');
                navigate('/login');
            } else {
                const text = await response.text();
                alert(`Erreur lors de l'inscription : ${text}`);
            }
        } catch (error) {
            console.error('Erreur :', error);
            alert('Une erreur est survenue. Veuillez réessayer.');
        }
    };

    return (
        <div>
            <h2>Inscription</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                >
                    <option value="client">Client</option>
                    <option value="prestataire">Prestataire</option>
                    <option value="administrateur">Administrateur</option>
                </select>
                <button type="submit">S'inscrire</button>
            </form>
        </div>
    );
}