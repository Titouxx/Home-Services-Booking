import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";

const Header = ({ basketCount }) => {
  const navigate = useNavigate();
  const [userStatus, setUserStatus] = useState(null);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });
        if (response.ok) {
          const userData = await response.json();
          setUserStatus(userData.status);
        }
      } catch (error) {
        console.error("Error checking user status:", error);
      }
    };

    checkUserStatus();
  }, []);

  if (userStatus === "administrateur") {
    return (
      <header className="header">
        <Link to="/admin" className="logo">
          PLANITY (Admin)
        </Link>
      </header>
    );
  } else if (userStatus === "client") {
    return (
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Link
          to="/"
          style={{
            color: "#4B6000",
            textDecoration: "none",
            fontSize: "2rem",
            fontWeight: "bold",
            fontFamily: "Georgia, serif",
          }}
        >
          PLANITY
        </Link>
        <nav>
          <Link
            to="/about"
            style={{
              marginRight: "15px",
              textDecoration: "none",
              color: "#4B6000",
              fontWeight: "bold",
            }}
          >
            Who we are
          </Link>
          <Link
            to="/profile"
            style={{
              marginRight: "15px",
              textDecoration: "none",
              color: "#4B6000",
              fontWeight: "bold",
            }}
          >
            My profile
          </Link>
          <button
            onClick={() => navigate("/basket")}
            style={{
              background: "#4B6000",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Basket ({basketCount})
          </button>
        </nav>
      </header>
    );
  } else if (userStatus === "prestataire") {
    return (
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Link
          to="/provider-dashboard"
          style={{
            color: "#4B6000",
            textDecoration: "none",
            fontSize: "2rem",
            fontWeight: "bold",
            fontFamily: "Georgia, serif",
          }}
        >
          PLANITY
        </Link>
        <nav>
          <Link
            to="/about"
            style={{
              marginRight: "15px",
              textDecoration: "none",
              color: "#4B6000",
              fontWeight: "bold",
            }}
          >
            Who we are
          </Link>
          <Link
            to="/appointments"
            style={{
              marginRight: "15px",
              textDecoration: "none",
              color: "#4B6000",
              fontWeight: "bold",
            }}
          >
            My appointments
          </Link>
          <Link
            to="/message"
            style={{
              marginRight: "15px",
              textDecoration: "none",
              color: "#4B6000",
              fontWeight: "bold",
            }}
          >
            My messages
          </Link>
        </nav>
      </header>
    );
  }
};

export default Header;
