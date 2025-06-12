// src/components/ProviderHomePage.jsx
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/Calendar.css";

export function ProviderHomePage() {
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [timeSlots, setTimeSlots] = useState([]);

    // Load service options
    useEffect(() => {
        fetch("/api/services")
            .then((res) => res.json())
            .then((data) => setServices(data))
            .catch((err) => console.error("Failed to load services", err));
    }, []);

    const handleServiceChange = (id) => {
        setSelectedServices((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    const handleSaveServices = () => {
        alert("✅ Services saved: " + selectedServices.join(", "));
        // You can POST this to your backend if needed
    };

    const handleAddTimeSlot = () => {
        const dateStr = selectedDate.toLocaleDateString();
        setTimeSlots([...timeSlots, dateStr]);
        alert(`🕒 Time slot added for ${dateStr}`);
        // Optional: POST to your backend
    };

    return (
        <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
            <header style={headerStyle}>
                <h1 style={{ color: "#4B6000" }}>PLANITY</h1>
                <nav>
                    <a href="/about" style={linkStyle}>Who we are</a>
                    <a href="/profile" style={linkStyle}>My profile</a>
                    <a href="/" style={linkStyle}>User View</a>
                </nav>
            </header>

            <main style={{ display: "flex", gap: "40px", marginTop: "30px" }}>
                {/* Left column: Declare services */}
                <section style={{ flex: 1 }}>
                    <h2 style={sectionTitle}>Declare Your Services</h2>
                    {services.map((service) => (
                        <div key={service.id}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedServices.includes(service.id)}
                                    onChange={() => handleServiceChange(service.id)}
                                />
                                {" "}{service.name}
                            </label>
                        </div>
                    ))}
                    <button onClick={handleSaveServices} style={saveButtonStyle}>
                        Save Services
                    </button>
                </section>

                {/* Right column: Calendar */}
                <aside style={calendarCard}>
                    <h2 style={sectionTitle}>Set Your Availability</h2>
                    <Calendar
                        onChange={setSelectedDate}
                        value={selectedDate}
                        minDate={new Date()}
                        className="custom-calendar"
                    />
                    <button onClick={handleAddTimeSlot} className="calendar-button">
                        Add Time Slot on {selectedDate.toLocaleDateString()}
                    </button>
                </aside>
            </main>

            <footer style={{ marginTop: "50px", textAlign: "center", fontSize: "12px", color: "#666" }}>
                © All rights reserved
            </footer>
        </div>
    );
}

// === Styles ===
const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
};

const linkStyle = {
    marginRight: "15px",
    textDecoration: "none",
    color: "#4B6000",
    fontWeight: "bold",
};

const sectionTitle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "15px",
};

const calendarCard = {
    background: "#f7fbea",
    padding: "20px",
    borderRadius: "10px",
    width: "320px",
};

const saveButtonStyle = {
    marginTop: "15px",
    backgroundColor: "#4B6000",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
};
