import React, { useState } from "react";

export default function Header({ basketItems = [], onBasketClick }) {
    return (
        <header style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            padding: "1rem", 
            borderBottom: "1px solid #ccc",
            fontFamily: "Arial, sans-serif"
        }}>
            <h2 style={{ 
                color: "#4B6000",
                margin: 0,
                fontSize: "1.5rem"
            }}>PLANITY</h2>
            <nav style={{ 
                display: "flex", 
                gap: "1.5rem",
                alignItems: "center"
            }}>
                <a href="#" style={{
                    textDecoration: "none",
                    color: "#4B6000",
                    fontWeight: "bold",
                    fontSize: "0.9rem"
                }}>Who we are</a>
                <a href="#" style={{
                    textDecoration: "none",
                    color: "#4B6000",
                    fontWeight: "bold",
                    fontSize: "0.9rem"
                }}>My profile</a>
                <button 
                    onClick={onBasketClick}
                    style={{ 
                        backgroundColor: "#4B6000", 
                        color: "white", 
                        border: "none", 
                        padding: "0.5rem 1rem", 
                        borderRadius: "20px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.9rem"
                    }}
                >
                    <span>Basket</span>
                    <span style={{
                        backgroundColor: "white",
                        color: "#4B6000",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem"
                    }}>
                        {basketItems.length}
                    </span>
                </button>
            </nav>
        </header>
    );
}