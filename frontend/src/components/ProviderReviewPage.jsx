import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import "../styles/ReviewPage.css";

const ProviderReviewPage = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [provider, setProvider] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [providerRes, reviewsRes, userRes] = await Promise.all([
          fetch(`/api/auth/user/${providerId}`, {
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }),
          fetch(`/api/reviews/provider/${providerId}`, {
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }),
          fetch("/api/auth/me", {
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }),
        ]);

        if (!providerRes.ok) throw new Error("Failed to fetch provider");
        if (!reviewsRes.ok) throw new Error("Failed to fetch reviews");
        if (!userRes.ok) throw new Error("Failed to fetch user info");

        const [providerData, reviewsData, userData] = await Promise.all([
          providerRes.json(),
          reviewsRes.json(),
          userRes.json(),
        ]);

        setProvider(providerData);
        setReviews(reviewsData);
        setIsClient(userData.status === "client");
        setError(null);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [providerId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        providerId: parseInt(providerId),
        rating,
        comment,
      }),
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to submit review");
        return res.json();
      })
      .then((newReview) => {
        setReviews([...reviews, newReview]);
        setComment("");
        setError(null);
      })
      .catch((err) => {
        console.error("Error submitting review:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <Layout>
        <div className="review-page-container">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="review-page-container">
        <button onClick={() => navigate("/reviews")} className="back-button">
          ← Back to All Providers
        </button>

        <h2>Reviews for {provider?.username}</h2>

        {error && <p className="error-message">{error}</p>}

        {isClient && (
          <div className="review-form">
            <h3>Add Your Review</h3>
            <form onSubmit={handleSubmit}>
              <div className="rating-input">
                <label>Rating:</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  disabled={loading}
                >
                  {[5, 4, 3, 2, 1].map((num) => (
                    <option key={num} value={num}>
                      {num} ★
                    </option>
                  ))}
                </select>
              </div>
              <div className="comment-input">
                <label>Comment:</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        )}

        <div className="reviews-list">
          <h3>All Reviews</h3>
          {reviews.length === 0 ? (
            <p>No reviews yet for this provider.</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <span className="rating">{review.rating} ★</span>
                  <span className="date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="comment">{review.comment}</p>
                <p className="reviewer">
                  By: {review.user?.username || "Anonymous"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProviderReviewPage;
