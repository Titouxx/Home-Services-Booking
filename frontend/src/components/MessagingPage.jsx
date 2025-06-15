// src/components/MessagingPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Header from "./Header";
import "../styles/Messaging.css";
import Layout from "./Layout";
import Footer from "./Footer";

export default function MessagingPage() {
  const { otherUserId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const providerId = searchParams.get("providerId");
  const [me, setMe] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Récupérer la liste des conversations
  useEffect(() => {
    if (!me) return;

    fetch("/api/messages/conversations", {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((r) => {
        if (!r.ok) {
          throw new Error("Failed to fetch conversations");
        }
        return r.json();
      })
      .then((data) => {
        setConversations(data);
      })
      .catch((err) => {
        console.error("Error fetching conversations:", err);
        setError(err.message);
      });
  }, [me]);

  // Récupérer les messages d'une conversation
  useEffect(() => {
    if (!me || !otherUserId) return;

    setLoading(true);
    fetch(`/api/messages/conversation/${otherUserId}`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((r) => {
        if (!r.ok) {
          if (r.status === 401) {
            navigate("/login");
            throw new Error("Please log in to continue");
          }
          throw new Error("Failed to fetch messages");
        }
        return r.json();
      })
      .then(setMessages)
      .catch((err) => {
        console.error("Error fetching messages:", err);
        setError(err.message);
        if (err.message.includes("log in")) {
          navigate("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [me, otherUserId, navigate]);

  // 1) récupère "me" depuis /api/auth/me
  useEffect(() => {
    setLoading(true);
    fetch("/api/auth/me", {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((r) => {
        if (!r.ok) {
          if (r.status === 401) {
            navigate("/login");
            throw new Error("Please log in to continue");
          }
          throw new Error("Failed to fetch user data");
        }
        return r.text().then((text) => {
          try {
            return text ? JSON.parse(text) : {};
          } catch (e) {
            console.error("Error parsing JSON:", e);
            return {};
          }
        });
      })
      .then((user) => {
        if (user && user.id) {
          setMe(user);
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          console.error("Invalid user data received");
          navigate("/login");
        }
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setError(err.message);
        if (err.message.includes("log in")) {
          navigate("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  // Add this useEffect hook to your component
  useEffect(() => {
    if (!otherUserId) return;

    fetch(`/api/users/${otherUserId}`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((r) => {
        if (!r.ok) {
          throw new Error("Failed to fetch user details");
        }
        return r.json();
      })
      .then((user) => {
        setOtherUser(user);
      })
      .catch((err) => {
        console.error("Error fetching user details:", err);
        setError(err.message);
      });
  }, [otherUserId]);

  const handleSend = () => {
    if (!newMessage.trim() || !me || !otherUserId) return;

    setLoading(true);
    fetch("/api/messages/send", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ receiverId: +otherUserId, content: newMessage }),
    })
      .then((r) => {
        if (!r.ok) {
          if (r.status === 401) {
            navigate("/login");
            throw new Error("Please log in to continue");
          }
          return r.json().then((err) => {
            throw new Error(err.error || "Failed to send message");
          });
        }
        return r.json();
      })
      .then((m) => {
        setMessages((msgs) => [...msgs, m]);
        setNewMessage("");
        setError(null);
      })
      .catch((err) => {
        console.error("Error sending message:", err);
        setError(err.message);
        if (err.message.includes("log in")) {
          navigate("/login");
        }
      })
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <Layout>
        <main className="messaging-main">
          <div className="messaging-container">
            <p>Loading...</p>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="messaging-main">
        <div className="messaging-container">
          <div className="conversations-list">
            <h2>Conversations</h2>
            {conversations.length === 0 ? (
              <p>Aucune conversation</p>
            ) : (
              <div className="conversations">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`conversation ${
                      conv.id === otherUserId ? "active" : ""
                    }`}
                    onClick={() => navigate(`/messages/${conv.id}`)}
                  >
                    <div className="conversation-header">
                      <span className="username">{conv.username}</span>
                      <span className="date">
                        {new Date(conv.lastMessageDate).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="last-message">{conv.lastMessage}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="chat-container">
            {!me ? (
              <p>Please log in to see your messages.</p>
            ) : !otherUserId ? (
              <p>Select a conversation to start chatting</p>
            ) : (
              <>
                <div className="chat-header">
                  <h2>
                    Chat with {otherUser ? `${otherUser.username}` : "User"}
                  </h2>
                </div>
                <div className="messages">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`message ${
                        message.senderId === me.id ? "sent" : "received"
                      }`}
                    >
                      <p>{message.content}</p>
                      <span className="message-date">
                        {new Date(message.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="message-input">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message…"
                    disabled={loading}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  />
                  <button onClick={handleSend} disabled={loading}>
                    Send
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
}
