import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

const MessagingPage = () => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const senderId = 1;    // 💡 ID utilisateur connecté (ex: prestataire)
  const receiverId = 2;  // 💡 ID destinataire (ex: client)

  useEffect(() => {
    fetch(`/api/messages/${senderId}/${receiverId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Erreur chargement messages:", err));
  }, []);

  const handleSend = () => {
    if (!content.trim()) return;

    fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderId, receiverId, content }),
    })
      .then((res) => res.json())
      .then((newMsg) => {
        setMessages((prev) => [...prev, newMsg]);
        setContent("");
      })
      .catch((err) => console.error("Erreur envoi message:", err));
  };

  return (
    <>
      <Header />
      <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
        <h2 style={{ color: "#4B6000" }}>💬 Messagerie</h2>

        <div style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "1rem", marginBottom: "1rem" }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{ marginBottom: "0.5rem" }}>
              <strong style={{ color: msg.sender.id === senderId ? "#4B6000" : "#888" }}>
                {msg.sender.id === senderId ? "Moi" : "Lui"} :
              </strong>{" "}
              {msg.content}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Écrire un message..."
            style={{ flex: 1, padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          <button
            onClick={handleSend}
            style={{ background: "#4B6000", color: "white", border: "none", padding: "8px 16px", borderRadius: "5px" }}
          >
            Envoyer
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MessagingPage;
