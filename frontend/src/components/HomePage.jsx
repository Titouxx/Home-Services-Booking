// src/components/HomePage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MyCalendar from "./Calendar";
import "../styles/HomePage.css";
import Layout from "./Layout";

export function HomePage() {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [basketItems, setBasketItems] = useState(() => {
        const saved = localStorage.getItem("basketItems");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        fetch("/api/services")
            .then((res) => res.json())
            .then((data) => setServices(data))
            .catch((err) => console.error("Failed to fetch services:", err));
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleCardClick = (e, service) => {
        if (e.target.closest("button")) return;
        setSelectedService(service);
    };

    const addToBasket = (service) => {
        const newItem = {
            id: Date.now(),
            service,
            date: null,
            time: null,
        };
        const updatedItems = [...basketItems, newItem];
        setBasketItems(updatedItems);
        localStorage.setItem("basketItems", JSON.stringify(updatedItems));
    };

    return (
        <Layout basketCount={basketItems.length}>
            <main className="home-main">
                <section className="service-list">
                    <div className="section-title">
                        <h2>Our Services</h2>
                        <hr />
                    </div>

                    {services.length === 0 ? (
                        <p>Loading services...</p>
                    ) : (
                        services.map((service) => (
                            <div
                                key={service.id}
                                onClick={(e) => handleCardClick(e, service)}
                                className={`service-card ${selectedService?.id === service.id ? "selected" : ""}`}
                                aria-label={`Select ${service.name}`}
                            >
                                <div>
                                    <h3>🔧 {service.name}</h3>
                                    <p style={{ color: "#4B6000" }}>
                                        {service.price}€ / {service.durationMinutes}min
                                    </p>
                                </div>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <Link
                                        to={`/services/${service.id}`}
                                        className="details-button"
                                        onClick={(e) => e.stopPropagation()}
                                        aria-label={`See details for ${service.name}`}
                                    >
                                        Details
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </section>

                <aside className="calendar-card">
                    <MyCalendar selectedService={selectedService} />
                </aside>
            </main>
        </Layout>

    );
}
