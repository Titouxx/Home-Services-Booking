import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import Footer from "./Footer";
import "../styles/BasketPage.css";

export function BasketPage() {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setIsLoading(true);
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) {
          setReservations([]);
          setIsLoading(false);
          return;
        }
        const response = await fetch(`/api/reservations/by-user/${user.id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setReservations(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch reservations:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleRemoveItem = async (id) => {
    if (!window.confirm("Are you sure you want to remove this booking?")) {
      return;
    }

    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete reservation");
      }

      setReservations(reservations.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to remove reservation:", err);
      alert("Failed to remove reservation. Please try again.");
    }
  };

  const calculateTotal = () => {
    return reservations.reduce(
      (total, item) => total + (item.customPrice || item.service?.price || 0),
      0
    );
  };

  const handleCheckout = () => {
    if (reservations.length === 0) {
      alert("Your basket is empty");
      return;
    }
    navigate("/checkout");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Group reservations by service/subservice name
  const groupedReservations = reservations.reduce((acc, item) => {
    const name = item.customName || item.service?.name || "Other";
    if (!acc[name]) acc[name] = [];
    acc[name].push(item);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <Layout>
        <main className="basket-container">
          <div className="loading-spinner">Loading your bookings...</div>
        </main>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <main className="basket-container">
          <div className="error-message">
            Error loading bookings: {error}
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        </main>
      </Layout>
    );
  }

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
              <Link to="/" className="basket-button">
                Browse Services
              </Link>
            </div>
          ) : (
            <>
              {Object.entries(groupedReservations).map(([serviceName, items]) => (
                <div key={serviceName} style={{ marginBottom: 24 }}>
                  <h3 style={{ color: '#4B6000', marginBottom: 8 }}>🔧 {serviceName}</h3>
                  {items.map(item => (
                    <div key={item.id} className="basket-item">
                      <div>
                        <p style={{ color: "#4B6000" }}>
                          {item.customPrice ?? item.service?.price}€ /{" "}
                          {item.customDuration ?? item.service?.durationMinutes}min
                        </p>
                        <p>
                          <strong>Date:</strong> {formatDate(item.appointmentDate)}
                          <br />
                          <strong>Time:</strong> {formatTime(item.appointmentDate)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="remove-button"
                        aria-label="Remove booking"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ))}

              <div className="basket-summary">
                <div>
                  <h3>Total: {calculateTotal()}€</h3>
                  <p>
                    {reservations.length} service
                    {reservations.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <button className="checkout-button" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </Layout>
  );
}
