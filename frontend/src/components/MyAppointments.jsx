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
        const response = await fetch("/api/reservations/by-user/current", {
          credentials: "include",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch appointments');
        }

        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        console.error("Error loading appointments:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

  const handleCancel = async (id) => {
    if (!window.confirm("Confirm cancellation of this appointment?")) return;

    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (response.status === 204) {
        setAppointments(prev => prev.filter(appt => appt.id !== id));
      } else {
        throw new Error('Failed to cancel appointment');
      }
    } catch (err) {
      console.error("Cancellation error:", err);
      setError(err.message);
    }
  };

  return (
    <Layout>
      <div className="appointments-container">
        <h2>My Appointments</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        {loading ? (
          <p>Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <ul className="appointments-list">
            {appointments.map(appt => (
              <li key={appt.id} className="appointment-item">
                <div>
                  <h3>{appt.service?.name || "Unknown Service"}</h3>
                  <p>
                    <strong>Date:</strong> {new Date(appt.appointmentDate).toLocaleString()}
                  </p>
                  {appt.customName && (
                    <p><strong>Client:</strong> {appt.customName}</p>
                  )}
                </div>
                <button 
                  onClick={() => handleCancel(appt.id)}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default MyAppointments;