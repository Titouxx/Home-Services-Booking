// src/components/BasketPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export function BasketPage() {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        fetch("/api/reservations")
            .then((res) => res.json())
            .then((data) => setReservations(data))
            .catch((err) => console.error("Failed to fetch reservations:", err));
    }, []);

    const handleRemoveItem = (id) => {
        setReservations(reservations.filter(item => item.id !== id));
    };

    const calculateTotal = () => {
        return reservations.reduce((total, item) => total + (item.service?.price || 0), 0);
    };

    return (
        <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Link to="/" style={logoStyle}>PLANITY</Link>
                <nav>
                    <Link to="/about" style={linkStyle}>Who we are</Link>
                    <Link to="/profile" style={linkStyle}>My profile</Link>
                    <button onClick={() => navigate("/basket")} style={basketStyle}>
                        Basket ({reservations.length})
                    </button>
                </nav>
            </header>


            <main style={{ marginTop: "30px" }}>
                <section style={{ maxWidth: "800px", margin: "0 auto" }}>
                    <div style={sectionTitle}>
                        <h2 style={sectionTitleH2}>Your Bookings</h2>
                        <hr style={sectionTitleHr} />
                    </div>

                    {reservations.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "40px" }}>
                            <p style={{ fontSize: "18px", marginBottom: "20px" }}>No reservations found</p>
                            <Link to="/" style={buttonStyle}>Browse Services</Link>
                        </div>
                    ) : (
                        <>
                            {reservations.map((item) => (
                                <div key={item.id} style={basketItemStyle}>
                                    <div>
                                        <h3>🔧 {item.service?.name ?? "Service"}</h3>
                                        <p style={{ color: "#4B6000" }}>
                                            {item.service?.price}€ / {item.service?.durationMinutes}min
                                        </p>
                                        <p>
                                            <strong>Date:</strong> {new Date(item.appointmentDate).toLocaleDateString()}<br />
                                            <strong>Time:</strong> {new Date(item.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <button onClick={() => handleRemoveItem(item.id)} style={removeButtonStyle}>
                                        Remove
                                    </button>
                                </div>
                            ))}

                            <div style={summaryStyle}>
                                <div>
                                    <h3>Total: {calculateTotal()}€</h3>
                                    <p>{reservations.length} service{reservations.length !== 1 ? 's' : ''}</p>
                                </div>
                                <button style={checkoutButtonStyle}>Proceed to Checkout</button>
                            </div>
                        </>
                    )}
                </section>
            </main>

            <footer style={{ marginTop: "50px", textAlign: "center", fontSize: "12px", color: "#666" }}>
                © All rights reserved
            </footer>
        </div>
    );
}

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

const buttonStyle = {
    background: "#4B6000",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "25px",
    cursor: "pointer",
    textDecoration: "none",
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

const basketItemStyle = {
    background: "#f7fbea",
    padding: "20px",
    marginBottom: "15px",
    borderRadius: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
};

const removeButtonStyle = {
    background: "#ff4d4d",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "bold",
};

const summaryStyle = {
    background: "#e4f0d8",
    padding: "20px",
    borderRadius: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "18px",
    fontWeight: "600",
};

const checkoutButtonStyle = {
    background: "#4B6000",
    color: "white",
    border: "none",
    padding: "10px 25px",
    borderRadius: "20px",
    cursor: "pointer",
};
const logoStyle = {
    color: "#4B6000",
    textDecoration: "none",
    fontSize: "2rem",
    fontWeight: "bold",
    fontFamily: "Georgia, serif",
};
