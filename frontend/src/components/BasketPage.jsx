import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import "../styles/BasketPage.css"; // ✅ Import CSS

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
        <Layout>
            <main className="basket-container">
                <section className="basket-section">
                    <div className="section-title">
                        <h2>Your Bookings</h2>
                        <hr />
                    </div>

                    {reservations.length === 0 ? (
                        <div className="empty-basket">
                            <p>No reservations found</p>
                            <Link to="/" className="basket-button">Browse Services</Link>
                        </div>
                    ) : (
                        <>
                            {reservations.map((item) => (
                                <div key={item.id} className="basket-item">
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
                                    <button onClick={() => handleRemoveItem(item.id)} className="remove-button">
                                        Remove
                                    </button>
                                </div>
                            ))}

                            <div className="basket-summary">
                                <div>
                                    <h3>Total: {calculateTotal()}€</h3>
                                    <p>{reservations.length} service{reservations.length !== 1 ? 's' : ''}</p>
                                </div>
                                <button className="checkout-button">Proceed to Checkout</button>
                            </div>
                        </>
                    )}
                </section>
            </main>
        </Layout>
    );
}
