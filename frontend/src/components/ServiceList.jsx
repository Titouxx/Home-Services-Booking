import React, { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";

const ServiceList = () => {
    const [services, setServices] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("/api/services", {
            method: "GET",
            credentials: "include", // 🔐 important pour la session
        })
            .then(async (res) => {
                if (!res.ok) {
                    const text = await res.text(); // lis même si pas JSON
                    throw new Error(`Erreur ${res.status}: ${text}`);
                }
                return res.json();
            })
            .then((data) => setServices(data))
            .catch((err) => {
                console.error("Error fetching services:", err);
                setError("❌ Impossible de récupérer les services. Es-tu bien connecté ?");
            });
    }, []);

    return (
        <div className="service-list">
            {error && <p style={{ color: "red" }}>{error}</p>}
            {services.length > 0 ? (
                services.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                ))
            ) : !error ? (
                <p>Aucun service disponible.</p>
            ) : null}
        </div>
    );
};

export default ServiceList;
