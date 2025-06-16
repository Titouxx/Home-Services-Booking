import { useState, useEffect } from "react";
import Header from "./Header";
import "../styles/Profile.css";
import Layout from "./Layout";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((u) => {
        setUser(u);
        setForm({
          firstName: u.firstName || "",
          lastName: u.lastName || "",
          age: u.age || "",
          email: u.email || "",
          password: "",
        });
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resp = await fetch("/api/auth/me", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (resp.ok) {
      const updated = await resp.json();
      setUser(updated);
      setEditing(false);
    } else {
      alert("Update failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="profile-container">
          <p>Loading profile...</p>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <div className="profile-container">
          <p>You are not logged in.</p>
        </div>
      </>
    );
  }

  return (
    <Layout>
      <div className="profile-container">
        <h2>My Profile</h2>

        {!editing && (
          <p className="profile-intro">
            Your username is <strong>{user.username}</strong> and your status is{" "}
            <strong>{user.status}</strong>.<br />
            Would you like to complete or modify these details?
          </p>
        )}

        {!editing ? (
          <>
            <p>
              <strong>First name:</strong> {user.firstName || "—"}
            </p>
            <p>
              <strong>Last name:</strong> {user.lastName || "—"}
            </p>
            <p>
              <strong>Age:</strong> {user.age || "—"}
            </p>
            <p>
              <strong>Email:</strong> {user.email || "—"}
            </p>

            <button onClick={() => setEditing(true)} className="edit-button">
              Edit Profile
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="profile-form">
            <label>
              First name
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
              />
            </label>
            <label>
              Last name
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
              />
            </label>
            <label>
              Age
              <input
                name="age"
                type="number"
                value={form.age}
                onChange={handleChange}
              />
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />
            </label>
            <label>
              New password
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
              />
            </label>

            <div className="profile-form-buttons">
              <button type="submit" className="save-button">
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
}
