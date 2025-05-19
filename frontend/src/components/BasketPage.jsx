// src/components/BasketPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export function BasketPage() {
    const [basketItems, setBasketItems] = useState(() => {
        const saved = localStorage.getItem("basketItems");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("basketItems", JSON.stringify(basketItems));
    }, [basketItems]);

    const handleRemoveItem = (id) => {
        setBasketItems(basketItems.filter(item => item.id !== id));
    };

    const calculateTotal = () => {
        return basketItems.reduce((total, item) => total + item.service.price, 0);
    };

    return (
        <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1 style={{ color: "#4B6000" }}>PLANITY</h1>
                <nav>
                    <Link to="/about" style={linkStyle}>Who we are</Link>
                    <Link to="/profile" style={linkStyle}>My profile</Link>
                    <Link to="/basket" style={{ ...basketStyle, textDecoration: 'none' }}>
                        Basket ({basketItems.length})
                    </Link>
                </nav>
            </header>

            <main style={{ marginTop: "30px" }}>
                <section style={{ maxWidth: "800px", margin: "0 auto" }}>
                    <div style={sectionTitle}>
                        <h2 style={sectionTitleH2}>Your Basket</h2>
                        <hr style={sectionTitleHr} />
                    </div>

                    {basketItems.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "40px" }}>
                            <p style={{ fontSize: "18px", marginBottom: "20px" }}>Your basket is empty</p>
                            <Link to="/" style={buttonStyle}>Browse Services</Link>
                        </div>
                    ) : (
                        <>
                            {basketItems.map((item) => (
                                <div key={item.id} style={basketItemStyle}>
                                    <div>
                                        <h3>🔧 {item.service.name}</h3>
                                        <p style={{ color: "#4B6000" }}>
                                            {item.service.price}€ / {item.service.durationMinutes}min
                                        </p>
                                        <p>
                                            <strong>Date:</strong> {item.date ?? "Not set"} <br />
                                            <strong>Time:</strong> {item.time ?? "Not set"}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        style={removeButtonStyle}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}

                            <div style={summaryStyle}>
                                <div>
                                    <h3>Total: {calculateTotal()}€</h3>
                                    <p>{basketItems.length} service{basketItems.length !== 1 ? 's' : ''}</p>
                                </div>
                                <button style={checkoutButtonStyle}>
                                    Proceed to Checkout
                                </button>
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

// Styles (identiques à ceux que tu as fournis)

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
    display: "inline-block",
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
