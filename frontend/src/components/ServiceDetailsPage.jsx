import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MyCalendar from "./Calendar";

const ServiceDetailsPage = () => {
    const { id } = useParams();
    const [subServices, setSubServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSubService, setSelectedSubService] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);

    useEffect(() => {
        fetch(`/api/subservices?serviceId=${id}`, {
            credentials: 'include'
        })
            .then((res) => {
                if (!res.ok) throw new Error("Sous-services non trouvés");
                return res.json();
            })
            .then((data) => {
                // Votre endpoint renvoie déjà les top 3 si vous utilisez findTop3... ;
                // sinon vous pouvez garder slice pour limiter côté client.
                setSubServices(data.slice(0, 3));
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    const handleBookClick = () => {
        if (!selectedSubService) {
            alert("Veuillez sélectionner un sous-service.");
            return;
        }
        setShowCalendar(true);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div style={{ fontFamily: "Arial, sans-serif" }}>
            <header
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "20px",
                    borderBottom: "1px solid #eee",
                }}
            >
                <Link
                    to="/"
                    style={{
                        textDecoration: "none",
                        color: "#4B6000",
                        fontSize: "24px",
                        fontWeight: "bold",
                    }}
                >
                    PLANITY
                </Link>
                <nav>
                    <Link to="/terms" style={linkStyle}>
                        Who we are
                    </Link>
                    <Link to="/profile" style={linkStyle}>
                        My profile
                    </Link>
                    <button style={basketStyle}>Basket (3)</button>
                </nav>
            </header>

            <div style={{ padding: "2rem" }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "1.5rem",
                    }}
                >
                    <h2 style={{ color: "#4B6000" }}>Sub-services</h2>
                    <button onClick={handleBookClick} style={bookButtonStyle}>
                        Book
                    </button>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "2rem",
                        flexWrap: "wrap",
                    }}
                >
                    {subServices.map((sub) => (
                        <div
                            key={sub.id}
                            onClick={() => setSelectedSubService(sub)}
                            style={{
                                border:
                                    selectedSubService?.id === sub.id
                                        ? "2px solid #4B6000"
                                        : "1px solid #ddd",
                                padding: "1.5rem",
                                borderRadius: "12px",
                                backgroundColor: "#f9fce8",
                                maxWidth: "400px",
                                maxHeight: "400px",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                cursor: "pointer",
                            }}
                        >
                            <h3 style={{ color: "#4B6000" }}>🔧 {sub.name}</h3>
                            <p>
                                <strong style={{ color: "#4B6000" }}>Prix :</strong> {sub.price} € /{" "}
                                {sub.duration_minutes} minutes
                            </p>
                            <div
                                style={{
                                    backgroundColor: "white",
                                    padding: "1rem",
                                    borderRadius: "8px",
                                    borderLeft: "3px solid #4B6000",
                                }}
                            >
                                {sub.description}
                            </div>
                        </div>
                    ))}
                </div>

                {showCalendar && (
                    <div style={modalOverlay} onClick={() => setShowCalendar(false)}>
                        <div style={modalContent} onClick={(e) => e.stopPropagation()}>
                            <MyCalendar selectedService={selectedSubService} />
                        </div>
                    </div>
                )}
            </div>

            <footer
                style={{
                    marginTop: "50px",
                    textAlign: "center",
                    padding: "20px",
                    borderTop: "1px solid #eee",
                }}
            >
                © {new Date().getFullYear()} PLANITY. All rights reserved.
                <Link to="/terms" style={{ marginLeft: "15px", ...linkStyle }}>
                    Terms of Service
                </Link>
            </footer>
        </div>
    );
};

// Styles
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
};

const bookButtonStyle = {
    background: "#4B6000",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
};

const modalOverlay = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.25)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
};

const modalContent = {
    background: "transparent",
    padding: "25px",
    borderRadius: "12px",
    width: "320px",
};

export default ServiceDetailsPage;