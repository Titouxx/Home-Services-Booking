import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);

        // First get current user info to determine role
        const userResponse = await fetch("http://localhost:8080/api/auth/me", {
          credentials: "include",
        });

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user info");
        }

        const user = await userResponse.json();
        const endpoint =
          user.status === "prestataire"
            ? "/api/reservations/by-provider/current"
            : "/api/reservations/by-user/current";

        const response = await fetch(`http://localhost:8080${endpoint}`, {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.error || "Failed to fetch appointments");
        }

        setAppointments(responseData);
      } catch (err) {
        console.error("Error loading appointments:", err);
        setError(err.message);
        if (
          err.message.includes("authenticated") ||
          err.message.includes("Unauthorized")
        ) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

  const handleCancel = async (id) => {
    if (!window.confirm("Confirm cancellation of this appointment?")) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/reservations/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.status === 204) {
        setAppointments((prev) => prev.filter((appt) => appt.id !== id));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to cancel appointment");
      }
    } catch (err) {
      console.error("Cancellation error:", err);
      setError(err.message);
    }
  };

  return (
    <Layout>
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ marginBottom: "1.5rem", color: "#2c3e50" }}>
          My Appointments
        </h2>

        {error && (
          <div
            style={{
              color: "#e74c3c",
              padding: "1rem",
              marginBottom: "1rem",
              backgroundColor: "#fadbd8",
              borderRadius: "4px",
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <p>Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {appointments.map((appt) => (
              <div
                key={appt.id}
                style={{
                  padding: "1.5rem",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h3 style={{ margin: "0 0 0.5rem 0", color: "#3498db" }}>
                    {appt.service?.name || "Unknown Service"}
                  </h3>
                  <p style={{ margin: "0.25rem 0" }}>
                    <strong>Date:</strong>{" "}
                    {new Date(appt.appointmentDate).toLocaleString()}
                  </p>
                  {appt.customName && (
                    <p style={{ margin: "0.25rem 0" }}>
                      <strong>Client:</strong> {appt.customName}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleCancel(appt.id)}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#e74c3c",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyAppointments;
