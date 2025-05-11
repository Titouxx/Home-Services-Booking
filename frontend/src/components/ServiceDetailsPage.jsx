// Fichier : src/main/resources/static/react-ui/components/ServiceDetailsPage.js

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ServiceDetailsPage = () => {
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`/api/services/${id}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Service non trouvé");
                }
                return res.json();
            })
            .then((data) => {
                setService(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>Erreur : {error}</p>;

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Détails du service</h2>
            <div style={{
                border: "1px solid #ddd",
                padding: "1rem",
                borderRadius: "12px",
                backgroundColor: "#f9fce8",
                maxWidth: "600px"
            }}>
                <img src={`/static/icons/${service.icon}`} alt={service.name} style={{ width: "50px" }} />
                <h3>{service.name}</h3>
                <p><strong>Prix :</strong> {service.price} € / h</p>
                <p><strong>Description :</strong> {service.description}</p>
            </div>
        </div>
    );
};

export default ServiceDetailsPage;
