import React from "react";

export default function Header() {
    return (
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", borderBottom: "1px solid #ccc" }}>
            <h2 style={{ color: "#556B2F" }}>PLANITY</h2>
            <nav style={{ display: "flex", gap: "1rem" }}>
                <a href="#">Who we are</a>
                <a href="#">My profile</a>
                <button style={{ backgroundColor: "#6B8E23", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "8px" }}>Basket (3)</button>
            </nav>
        </header>
    );
}
