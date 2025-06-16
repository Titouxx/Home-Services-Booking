import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import Header from "./Header";
import "../styles/ReviewList.css";

const ReviewListPage = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/reviews/providers", {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch providers");
        return res.json();
      })
      .then((data) => {
        // Ensure each provider has a services array
        const providersWithServices = data.map((provider) => ({
          ...provider,
          services: provider.services || [], // Default to empty array if undefined
        }));
        setProviders(providersWithServices);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching providers:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="review-list-container">
          <p>Loading providers...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="review-list-container">
        <h2>All Service Providers</h2>
        {error && <p className="error-message">{error}</p>}

        {providers.length === 0 ? (
          <p>No providers found.</p>
        ) : (
          <div className="providers-list">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="provider-item"
                onClick={() => navigate(`/provider/${provider.id}/reviews`)}
              >
                <div className="provider-info">
                  <h3>{provider.username}</h3>
                </div>
                <div className="review-status">
                  {provider.hasReviewed ? (
                    <span className="reviewed">Reviewed</span>
                  ) : (
                    <span className="not-reviewed">View Reviews</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ReviewListPage;
