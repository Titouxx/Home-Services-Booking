// src/components/AdminPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import "../styles/AdminPage.css";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Check if user is admin
        const userRes = await fetch("/api/auth/me", { credentials: "include" });
        if (!userRes.ok) {
          navigate("/login");
          return;
        }

        const userData = await userRes.json();
        if (userData.status !== "administrateur") {
          navigate("/");
          return;
        }

        // Fetch users and reservations
        const [usersRes, reservationsRes] = await Promise.all([
          fetch("/api/auth/users", { credentials: "include" }),
          fetch("/api/reservations", { credentials: "include" }),
        ]);

        if (!usersRes.ok || !reservationsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const allUsers = await usersRes.json();
        // Filter out admin users
        setUsers(allUsers.filter((user) => user.status !== "administrateur"));
        setReservations(await reservationsRes.json());
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleDeleteUser = async (userId) => {
    try {
      const res = await fetch(`/api/auth/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setUsers(users.filter((user) => user.id !== userId));
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteReservation = async (reservationId) => {
    try {
      const res = await fetch(`/api/reservations/${reservationId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setReservations(reservations.filter((res) => res.id !== reservationId));
      } else {
        throw new Error("Failed to delete reservation");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading)
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  if (error)
    return (
      <Layout>
        <div>Error: {error}</div>
      </Layout>
    );

  return (
    <Layout isAdmin={true}>
      <div className="admin-container">
        <h1>Admin Dashboard</h1>

        <section className="admin-section">
          <h2>Users Management</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.status}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-section">
          <h2>Reservations Management</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Custom Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((res) => (
                  <tr key={res.id}>
                    <td>{res.id}</td>
                    <td>{res.service?.name || res.customName}</td>
                    <td>{new Date(res.appointmentDate).toLocaleString()}</td>
                    <td>{res.customName || "-"}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteReservation(res.id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AdminPage;
