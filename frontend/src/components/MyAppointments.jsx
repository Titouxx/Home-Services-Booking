import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reservations")
      .then((res) => res.json())
      .then((data) => {
        setAppointments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement réservations:", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Confirmer l'annulation de ce rendez-vous ?")) return;

    fetch(`/api/reservations/${id}`, { method: "DELETE" })
      .then((res) => {
        if (res.status === 204) {
          setAppointments((prev) => prev.filter((appt) => appt.id !== id));
        } else {
          alert("Erreur lors de l'annulation.");
        }
      })
      .catch((err) => {
        console.error("Erreur suppression:", err);
        alert("Une erreur est survenue.");
      });
  };

  if (loading) return <p style={{ padding: "2rem" }}>Chargement des rendez-vous...</p>;

  return (
    <>
      <Header />
      <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
        <h2 style={{ color: "#4B6000", marginBottom: "1rem" }}>📋 My Appointments</h2>

        {appointments.length === 0 ? (
          <p>Aucun rendez-vous pour le moment.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {appointments.map((appt) => (
              <li
                key={appt.id}
                style={{
                  backgroundColor: "#f7fbea",
                  padding: "1rem",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong style={{ color: "#4B6000" }}>
                    {appt.service?.name ?? "Service inconnu"}
                  </strong>
                  <p style={{ margin: 0 }}>
                    📅 {new Date(appt.appointmentDate).toLocaleString()}<br />
                    🕒 {appt.customDuration} min – 💶 {appt.customPrice} €<br />
                    👤 Client : {appt.customName}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(appt.id)}
                  style={{
                    background: "#c0392b",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Annuler
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyAppointments;
