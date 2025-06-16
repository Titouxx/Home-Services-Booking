import { Link, useNavigate } from "react-router-dom";
import "../styles/Footer.css";

export default function Footer({ isAdmin = false }) {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        navigate("/login");
      } else {
        console.error("Logout failed:", res.status);
        alert("La déconnexion a échoué. Veuillez réessayer.");
      }
    } catch (err) {
      console.error("Logout error:", err);
      alert("Erreur réseau lors de la déconnexion.");
    }
  };

  if (isAdmin) {
    return (
      <footer className="footer">
        <span>© All rights reserved</span>
        <button onClick={handleLogout} className="footer-button">
          Logout
        </button>
      </footer>
    );
  }

  return (
    <footer className="footer">
      <span>© All rights reserved</span>
      <Link to="/terms" className="footer-link">
        Terms of Service
      </Link>
      <button onClick={handleLogout} className="footer-button">
        Logout
      </button>
    </footer>
  );
}
