import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import "../styles/AdminPage.css";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const formatDate = (dateInput) => {
    console.log("Raw date input:", dateInput);

    if (!dateInput) return "N/A";

    try {
      if (dateInput instanceof Date) {
        return dateInput.toLocaleString();
      }

      if (typeof dateInput === "string") {
        const isoDate = new Date(dateInput);
        if (!isNaN(isoDate.getTime())) return isoDate.toLocaleString();

        const localDate = parseLocalDateTime(dateInput);
        if (localDate) return localDate.toLocaleString();
      }

      if (!isNaN(dateInput)) {
        const date = new Date(Number(dateInput));
        if (!isNaN(date.getTime())) return date.toLocaleString();
      }

      if (Array.isArray(dateInput)) {
        const [year, month, day, hour = 0, minute = 0] = dateInput;
        const date = new Date(year, month - 1, day, hour, minute);
        if (!isNaN(date.getTime())) return date.toLocaleString();
      }

      console.warn("Unrecognized date format:", dateInput);
      return "Invalid Date";
    } catch (e) {
      console.error("Date formatting error:", e);
      return "Invalid Date";
    }
  };

  const parseLocalDateTime = (str) => {
    if (!str) return null;
    let s = str.replace("T", " ");
    const [datePart, timePart] = s.split(" ");
    if (!datePart || !timePart) return null;
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute, second] = timePart.split(":").map(Number);
    return new Date(year, month - 1, day, hour, minute, second);
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
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

        const [usersRes, reservationsRes, reviewsRes] = await Promise.all([
          fetch("/api/auth/users", { credentials: "include" }),
          fetch("/api/reservations", { credentials: "include" }),
          fetch("/api/reviews", { credentials: "include" }),
        ]);

        if (!usersRes.ok || !reservationsRes.ok || !reviewsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const allUsers = await usersRes.json();
        setUsers(allUsers.filter((user) => user.status !== "administrateur"));

        const reservationsData = await reservationsRes.json();
        setReservations(
          reservationsData.map((res) => ({
            ...res,
            appointment_date: res.appointment_date || res.appointmentDate,
          }))
        );

        const reviewsData = await reviewsRes.json();
        setReviews(
          reviewsData.map((rev) => ({
            ...rev,
            created_at: rev.created_at || rev.createdAt,
          }))
        );

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

  const handleDeleteReview = async (reviewId) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setReviews(reviews.filter((review) => review.id !== reviewId));
      } else {
        throw new Error("Failed to delete review");
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
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>
                      {user.first_name} {user.last_name}
                    </td>
                    <td>{user.email}</td>
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
                  <th>Client</th>
                  <th>Provider</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((res) => (
                  <tr key={res.id}>
                    <td>{res.id}</td>
                    <td>{res.service?.name || res.custom_name}</td>
                    <td>{formatDate(res.appointment_date)}</td>
                    <td>{res.user_id}</td>
                    <td>{res.provider_id || "-"}</td>
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

        <section className="admin-section">
          <h2>Reviews Management</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Service</th>
                  <th>Client</th>
                  <th>Provider</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.id}>
                    <td>{review.id}</td>
                    <td>{review.rating}/5</td>
                    <td>{review.comment || "-"}</td>
                    <td>{review.service_id}</td>
                    <td>{review.user_id}</td>
                    <td>{review.provider_id}</td>
                    <td>{formatDate(review.created_at)}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
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
