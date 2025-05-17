import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const ServiceDetailsPage = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/services/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Service non trouvé");
        return res.json();
      })
      .then((data) => {
        setService(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error}</p>;

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
          <a href="/templates/login.html" style={linkStyle}>
            Who we are
          </a>
          <a href="/templates/login.html" style={linkStyle}>
            My profile
          </a>
          <button style={basketStyle}>Basket (3)</button>
        </nav>
      </header>

      <div style={{ padding: "2rem" }}>
        <h2 style={{ color: "#4B6000", marginBottom: "1.5rem" }}>
          Service Details
        </h2>
        <div
          style={{
            border: "1px solid #ddd",
            padding: "1.5rem",
            borderRadius: "12px",
            backgroundColor: "#f9fce8",
            maxWidth: "600px",
            margin: "0 auto",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <h3 style={{ margin: 0, color: "#4B6000" }}>🔧 {service.name}</h3>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <strong style={{ color: "#4B6000" }}>Price :</strong>
            <span style={{ marginLeft: "0.5rem" }}>{service.price} € / h</span>
          </div>

          <div>
            <strong
              style={{
                color: "#4B6000",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              Description :
            </strong>
            <div
              style={{
                backgroundColor: "white",
                padding: "1rem",
                borderRadius: "8px",
                borderLeft: "3px solid #4B6000",
                lineHeight: "1.6",
              }}
            >
              {service.description ||
                "Aucune description disponible pour ce service."}
            </div>
          </div>
        </div>
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
        <Link
          to="/terms"
          style={{
            marginLeft: "15px",
            color: "#4B6000",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Terms of Service
        </Link>
      </footer>
    </div>
  );
};

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
  padding: "8px 16px",
  borderRadius: "5px",
  cursor: "pointer",
};

export default ServiceDetailsPage;
