import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MyCalendar from "./Calendar";
import Footer from "./Footer";

export function HomePage() {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [basketItems, setBasketItems] = useState(() => {
        const saved = localStorage.getItem("basketItems");
        return saved ? JSON.parse(saved) : [];
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetch("/api/services")
            .then((res) => res.json())
            .then((data) => setServices(data))
            .catch((err) => console.error("Failed to fetch services:", err));
    }, []);

    useEffect(() => {
        localStorage.setItem("basketItems", JSON.stringify(basketItems));
    }, [basketItems]);

    const handleCardClick = (e, service) => {
        if (e.target.closest("button")) return;
        setSelectedService(service);
    };

    const handleBasketClick = () => {
        navigate("/basket");
    };

    return (
        <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
            <header
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Link to="/" style={logoStyle}>
                    PLANITY
                </Link>

                <nav>
                    <Link to="/about" style={linkStyle}>
                        Who we are
                    </Link>
                    <Link to="/profile" style={linkStyle}>
                        My profile
                    </Link>
                    <Link to="/provider-dashboard" style={linkStyle}>
                        Provider Dashboard
                    </Link>

                    <button onClick={handleBasketClick} style={basketStyle}>
                        Basket ({basketItems.length})
                    </button>
                </nav>
            </header>

            <main style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
                <section style={serviceListStyle}>
                    <div style={sectionTitle}>
                        <h2 style={sectionTitleH2}>Our Services</h2>
                        <hr style={sectionTitleHr} />
                    </div>

                    {services.map((service) => (
                        <div
                            key={service.id}
                            onClick={(e) => handleCardClick(e, service)}
                            style={{
                                ...serviceCard,
                                border:
                                    selectedService?.id === service.id
                                        ? "2px solid #4B6000"
                                        : "none",
                                cursor: "pointer",
                            }}
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
                                    style={buttonStyle}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </section>

                <aside style={calendarCard}>
                    <MyCalendar selectedService={selectedService} />
                </aside>
            </main>

            {/* Appel du footer partagé */}
            <Footer />
        </div>
    );
}

// === Styles ===
const linkStyle = {
    marginRight: "15px",
    textDecoration: "none",
    color: "#4B6000",
    fontWeight: "bold",
};

const basketStyle = {
    background: "#4B6000",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer",
};

const serviceCard = {
    background: "#f7fbea",
    padding: "15px",
    marginBottom: "15px",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "box-shadow 0.2s ease",
};

const buttonStyle = {
    background: "#4B6000",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "0.9rem",
};

const calendarCard = {
    marginRight: "30px",
    marginTop: "48px",
    padding: "15px",
    borderRadius: "10px",
    width: "300px",
};

const serviceListStyle = {
    flex: 3,
    maxHeight: "75vh",
    overflowY: "auto",
    paddingRight: "10px",
};

const sectionTitle = {
    marginBottom: "20px",
};

const sectionTitleH2 = {
    fontSize: "2rem",
    fontWeight: "500",
    marginBottom: "5px",
    fontFamily: "Georgia, serif",
};

const sectionTitleHr = {
    border: "none",
    borderTop: "1px solid #e0e0e0",
};

const logoStyle = {
    color: "#4B6000",
    textDecoration: "none",
    fontSize: "2rem",
    fontWeight: "bold",
    fontFamily: "Georgia, serif",
};