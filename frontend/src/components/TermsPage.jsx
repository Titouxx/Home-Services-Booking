import React from "react";
import { Link } from "react-router-dom";

const TermsPage = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <Link to="/" style={styles.logoLink}>
          PLANITY
        </Link>
      </header>

      <h1 style={styles.title}>Terms of Service</h1>

      <div>
        <h2 style={styles.sectionTitle}>1. General Terms</h2>
        <p style={styles.paragraph}>
          By accessing and using the PLANITY platform, you accept and agree to
          be bound by these Terms of Service.
        </p>

        <h2 style={styles.sectionTitle}>2. Services</h2>
        <p style={styles.paragraph}>
          PLANITY connects users with home service professionals for cleaning,
          plumbing, electrical work, and other services.
        </p>

        <h2 style={styles.sectionTitle}>3. Booking Policy</h2>
        <p style={styles.paragraph}>
          All service bookings require payment authorization. Cancellations must
          be made at least 24 hours before the scheduled service.
        </p>

        <h2 style={styles.sectionTitle}>4. Liability</h2>
        <p style={styles.paragraph}>
          PLANITY acts as an intermediary between users and service providers.
          We are not liable for any damages occurring during service provision.
        </p>

        <h2 style={styles.sectionTitle}>5. Privacy</h2>
        <p style={styles.paragraph}>
          Your personal data is processed according to our Privacy Policy. We
          never share your information with third parties without consent.
        </p>

        <h2 style={styles.sectionTitle}>6. Changes to Terms</h2>
        <p style={styles.paragraph}>
          We may modify these terms at any time. Continued use of the platform
          constitutes acceptance of the modified terms.
        </p>

        <p style={styles.lastUpdated}>
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <footer style={styles.footer}>
        <Link to="/" style={styles.backLink}>
          ← Back to Home
        </Link>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Arial', sans-serif",
    padding: "2rem",
    maxWidth: "800px",
    margin: "0 auto",
    lineHeight: 1.6,
    color: "#333",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    borderBottom: "1px solid #eee",
    marginBottom: "2rem",
  },
  logoLink: {
    textDecoration: "none",
    color: "#4B6000",
    fontSize: "24px",
    fontWeight: "bold",
  },
  title: {
    color: "#4B6000",
    marginBottom: "1.5rem",
    fontSize: "28px",
  },
  sectionTitle: {
    color: "#4B6000",
    margin: "1.5rem 0 1rem 0",
    fontSize: "20px",
  },
  paragraph: {
    marginBottom: "1rem",
  },
  lastUpdated: {
    marginTop: "2rem",
    fontStyle: "italic",
    color: "#666",
  },
  footer: {
    marginTop: "50px",
    textAlign: "center",
    padding: "20px",
    borderTop: "1px solid #eee",
  },
  backLink: {
    color: "#4B6000",
    textDecoration: "none",
    fontWeight: "bold",
    display: "inline-block",
    padding: "8px 16px",
    border: "1px solid #4B6000",
    borderRadius: "4px",
    transition: "all 0.3s ease",
    ":hover": {
      backgroundColor: "#4B6000",
      color: "white",
    },
  },
};

export default TermsPage;
