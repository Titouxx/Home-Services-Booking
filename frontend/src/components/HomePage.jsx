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
    const [searchTerm, setSearchTerm] = useState("");

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

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout basketCount={basketItems.length}>
            <main className="home-main">
                <section className="service-list">
                    <div className="section-title-with-search">
                        <h2>Our Services</h2>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search services..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <hr />

                    {filteredServices.length === 0 ? (
                        <p>No services found.</p>
                    ) : (
                        filteredServices.map((service) => (
                            <div
                                key={service.id}
                                onClick={(e) => handleCardClick(e, service)}
                                className={`service-card ${selectedService?.id === service.id ? "selected" : ""}`}
                                aria-label={`Select ${service.name}`}
                            >
                                <div>
                                    <h3>🔧 {service.name}</h3>
                                    <p className="service-price">
                                        {service.price}€ / {service.durationMinutes}min
                                    </p>
                                </div>
                                <div className="button-container">
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
