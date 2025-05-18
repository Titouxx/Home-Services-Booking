import React, { useEffect, useState } from "react";

const BasketPage = () => {
  const [basketItems, setBasketItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/basket")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors de la récupération du panier.");
        return res.json();
      })
      .then((data) => {
        setBasketItems(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur :", error);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    fetch(`/api/basket/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Échec de la suppression.");
        setBasketItems((prev) => prev.filter((item) => item.id !== id));
      })
      .catch((err) => console.error("Suppression échouée :", err));
  };

  if (loading) return <p>Chargement du panier...</p>;

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ color: "#4B6000", marginBottom: "1rem" }}>🛒 My Basket</h2>
      {basketItems.length === 0 ? (
        <p>Your basket is empty.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {basketItems.map((item) => (
            <li
              key={item.id}
              style={{
                backgroundColor: "#f7fbea",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong style={{ color: "#4B6000" }}>{item.service_name}</strong>
                <p style={{ margin: 0 }}>
                  📅 {item.booking_date} ⏰ {item.booking_time}
                </p>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                style={{
                  background: "#c0392b",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BasketPage;
