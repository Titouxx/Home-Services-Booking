import React, { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";

const ServiceList = () => {
    const [services, setServices] = useState([]);
    const [error, setError] = useState(null); // pour afficher un message si nécessaire

    useEffect(() => {
        fetch("/api/services", {
            method: "GET",
            credentials: "include", // 🔐 nécessaire pour envoyer le cookie JSESSIONID
        })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
                return res.text(); // 🔄 lit la réponse brute
            })
            .then((text) => {
                console.log("🧾 Réponse brute du backend:", text);
                if (!text) throw new Error("Réponse vide du backend");
                return JSON.parse(text); // 🔍 essaie de parser le JSON
            })
            .then((data) => {
                setServices(data);
            })
            .catch((err) => {
                console.error("❌ Error fetching services:", err);
                setError(err.message);
            });
    }, []);

    return (
        <div className="service-list">
            {error && <p style={{ color: "red" }}>Erreur : {error}</p>}
            {services.length > 0 ? (
                services.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                ))
            ) : (
                !error && <p>Aucun service disponible.</p>
            )}
        </div>
    );
};

export default ServiceList;
