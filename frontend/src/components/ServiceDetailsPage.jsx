import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MyCalendar from "./Calendar";
import Header from "./Header";
import Footer from "./Footer";
import "../styles/ServiceDetailsPage.css";

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
            <Header />
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
                    <button onClick={handleBookClick} className="book-button">
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
                            className={`subservice-card${selectedSubService?.id === sub.id ? " selected" : ""}`}
                        >
                            <h3 style={{ color: "#4B6000" }}>🔧 {sub.name}</h3>
                            <p>
                                <strong style={{ color: "#4B6000" }}>Prix :</strong> {sub.price} € /{" "}
                                {sub.duration_minutes} minutes
                            </p>
                            <div className="subservice-description">
                                {sub.description}
                            </div>
                        </div>
                    ))}
                </div>

                {showCalendar && (
                    <div className="modal-overlay" onClick={() => setShowCalendar(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <MyCalendar selectedService={selectedSubService} />
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ServiceDetailsPage;