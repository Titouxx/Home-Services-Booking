import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Layout from "./Layout";

const ProviderReviewPage = () => {
  const { providerId } = useParams();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(`/api/reviews/provider/${providerId}`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error("Erreur chargement avis:", err));
  }, [providerId]);

  return (
    <Layout>
      <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
        <h2 style={{ color: "#4B6000" }}>
          ⭐ Avis sur le prestataire #{providerId}
        </h2>

        {reviews.length === 0 ? (
          <p>Aucun avis pour ce prestataire.</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              style={{
                backgroundColor: "#f7fbea",
                padding: "1rem",
                borderRadius: "10px",
                marginBottom: "1rem",
              }}
            >
              <p>
                <strong>Note :</strong> {review.rating} ★
              </p>
              <p>
                <strong>Commentaire :</strong> {review.comment}
              </p>
              <p style={{ fontSize: "0.8rem", color: "#888" }}>
                Posté le {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default ProviderReviewPage;
