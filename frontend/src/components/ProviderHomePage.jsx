// src/components/ProviderHomePage.jsx
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/Calendar.css";
import "../styles/ProviderHomePage.css";
import Layout from "./Layout";

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
        <Layout>
            <main className="provider-main">
                {/* Left column: Declare services */}
                <section className="provider-section">
                    <h2 className="section-title">Declare Your Services</h2>
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
                    <button onClick={handleSaveServices} className="save-button">
                        Save Services
                    </button>
                </section>

                {/* Right column: Calendar */}
                <aside className="provider-calendar">
                    <h2 className="section-title">Set Your Availability</h2>
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
        </Layout>

    );
}
