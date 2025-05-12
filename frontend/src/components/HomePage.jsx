import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function HomePage() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error("Failed to fetch services:", err));
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ color: "#4B6000" }}>PLANITY</h1>
        <nav>
          <a href="/templates/login.html" style={linkStyle}>
            Who we are
          </a>
          <a href="/templates/login.html" style={linkStyle}>
            My profile
          </a>
          <button style={basketStyle}>Basket (3)</button>
        </nav>
      </header>

      <main style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
        <section style={{ flex: 3 }}>
          <h2>Our Services</h2>
          {services.map((service) => (
            <div key={service.id} style={serviceCard}>
              <div>
                <h3>🔧 {service.name}</h3>
                <p style={{ color: "#4B6000" }}>
                  {service.price}€ / {service.durationMinutes}min
                </p>
              </div>
              <Link to={`/services/${service.id}`} style={buttonStyle}>
                Details
              </Link>
            </div>
          ))}
        </section>

        <aside style={calendarCard}>
          <h3>Calendar</h3>
          <textarea rows="5" style={{ width: "100%" }}>
            [Calendar Placeholder]
          </textarea>
          <button style={{ ...buttonStyle, marginTop: "10px", width: "100%" }}>
            Book →
          </button>
        </aside>
      </main>

      <footer
        style={{
          marginTop: "50px",
          textAlign: "center",
          fontSize: "12px",
          color: "#666",
        }}
      >
        © All rights reserved
      </footer>
    </div>
  );
}

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

const serviceCard = {
  background: "#f7fbea",
  padding: "15px",
  marginBottom: "15px",
  borderRadius: "10px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const buttonStyle = {
  background: "#4B6000",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "20px",
  cursor: "pointer",
};

const calendarCard = {
  background: "#f7fbea",
  padding: "15px",
  borderRadius: "10px",
  width: "300px",
};
