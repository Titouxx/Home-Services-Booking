import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MyCalendar from "./Calendar";

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
          <section style={serviceListStyle}>

              <div style={sectionTitle}>
                  <h2>Our Services</h2>
                  <hr />
              </div>

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
              <MyCalendar />
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

sectionTitle.h2 = {
    fontSize: "2rem",
    fontWeight: "500",
    marginBottom: "5px",
    fontFamily: "Georgia, serif",
};

sectionTitle.hr = {
    border: "none",
    borderTop: "1px solid #e0e0e0",
};
