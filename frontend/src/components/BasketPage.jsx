import React, { useEffect, useState } from "react";

const BasketPage = () => {
  const [basketItems, setBasketItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    console.log("✅ BasketPage chargé !");

    const mockData = [
      {
        id: 1,
        service_name: "Plomberie",
        booking_date: "2025-05-21",
        booking_time: "10:30",
      },
      {
        id: 2,
        service_name: "Ménage",
        booking_date: "2025-05-22",
        booking_time: "14:00",
      },
    ];

    // Simule un délai de chargement
    setTimeout(() => {
      setBasketItems(mockData);
      setLoading(false);
    }, 500); // 500 ms
  }, []);

  const handleDelete = (id) => {
    setBasketItems((prev) => prev.filter((item) => item.id !== id));
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
