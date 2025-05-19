import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const ServiceDetailsPage = () => {
  const { id } = useParams();
  const [subServices, setSubServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/subservices?serviceId=${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Sous-services non trouvés");
        return res.json();
      })
      .then((data) => {
        setSubServices(data.slice(0, 3));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

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
          Sub-services
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          {subServices.map((sub, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid #ddd",
                padding: "1.5rem",
                borderRadius: "12px",
                backgroundColor: "#f9fce8",
                maxWidth: "400px",
                maxHeight: "400px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ color: "#4B6000" }}>🔧 {sub.name}</h3>
              <p>
                <strong style={{ color: "#4B6000" }}>Prix :</strong> {sub.price}{" "}
                € / {sub.duration_minutes} minutes
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
  padding: "6px 12px",
  borderRadius: "5px",
};

export default ServiceDetailsPage;
