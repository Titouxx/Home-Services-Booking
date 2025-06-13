// src/components/ProviderHomePage.jsx
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/Calendar.css";
import "../styles/ProviderHomePage.css";
import Layout from "./Layout";
import Footer from "./Footer";

export function ProviderHomePage() {
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [timeSlots, setTimeSlots] = useState([]); // ISO strings
    const [loadingServices, setLoadingServices] = useState(true);
    const [selectedServiceNames, setSelectedServiceNames] = useState([]);

    // Get provider_id from localStorage (adapt if you use another auth system)
    const user = JSON.parse(localStorage.getItem("user"));
    const providerId = user?.id;

    // Load service options and availabilities
    useEffect(() => {
        if (!user || !providerId) {
            alert("You must be logged in as a provider.");
            window.location.href = "/login";
        }
        fetch("/api/services")
            .then((res) => res.json())
            .then((data) => setServices(data))
            .catch((err) => console.error("Failed to load services", err))
            .finally(() => setLoadingServices(false));
        // Fetch availabilities
        fetch(`/api/provider/availability?providerId=${providerId}`)
            .then((res) => res.json())
            .then((data) => {
                // data: array of { availableDate: "2024-06-20T10:00:00" }
                setTimeSlots(data.map(a => a.availableDate));
            })
            .catch(() => {});
        // Fetch selected services (optional, if you want to show them after reload)
        fetch(`/api/provider/services?providerId=${providerId}`)
            .then((res) => res.json())
            .then((data) => {
                setSelectedServiceNames(data.map(s => s.serviceName));
            })
            .catch(() => {});
    }, []);

    const handleServiceChange = (id) => {
        setSelectedServices((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    // Save selected services (by name) for this provider
    const handleSaveServices = async () => {
        if (!providerId) {
            alert("Provider ID not found. Please log in again.");
            return;
        }
        // Get names of selected services
        const selectedServiceNames = services
            .filter((s) => selectedServices.includes(s.id))
            .map((s) => s.name);
        try {
            const response = await fetch("/api/provider/services", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ providerId, serviceNames: selectedServiceNames }),
            });
            if (!response.ok) throw new Error("Failed to save services");
            setSelectedServiceNames(selectedServiceNames); // update left list
            alert("✅ Services saved!");
        } catch (err) {
            alert("❌ Error: " + err.message);
        }
    };

    // Save availability for this provider
    const handleAddTimeSlot = async () => {
        if (!providerId) {
            alert("Provider ID not found. Please log in again.");
            return;
        }
        const dateStr = selectedDate.toISOString().slice(0, 19); // 'YYYY-MM-DDTHH:mm:ss'
        if (timeSlots.includes(dateStr)) {
            alert("This time slot is already added.");
            return;
        }
        try {
            const response = await fetch("/api/provider/availability", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ providerId, date: dateStr }),
            });
            if (!response.ok) throw new Error("Failed to add time slot");
            setTimeSlots([...timeSlots, dateStr]);
            alert(`🕒 Time slot added for ${selectedDate.toLocaleDateString()}`);
        } catch (err) {
            alert("❌ Error: " + err.message);
        }
    };

    // Helper to check if a date is in timeSlots
    const isAvailable = (date) => {
        const d = date.toISOString().slice(0, 19);
        return timeSlots.some(slot => slot.startsWith(d.slice(0, 10)));
    };

    // Helper to format date
    const formatDate = (iso) => {
        const d = new Date(iso);
        return d.toLocaleString();
    };

    return (
        <Layout>
            <main className="provider-main">
                {/* Left column: Services and Availabilities */}
                <section className="provider-section">
                    <h2 className="section-title">My Services</h2>
                    <ul>
                        {selectedServiceNames.length === 0 ? (
                            <li style={{ color: '#888' }}>No services selected yet.</li>
                        ) : (
                            selectedServiceNames.map(name => (
                                <li key={name}>{name}</li>
                            ))
                        )}
                    </ul>
                    <h2 className="section-title">My Availabilities</h2>
                    <ul>
                        {timeSlots.length === 0 ? (
                            <li style={{ color: '#888' }}>No availabilities yet.</li>
                        ) : (
                            timeSlots.map(date => (
                                <li key={date}>{formatDate(date)}</li>
                            ))
                        )}
                    </ul>
                    <h2 className="section-title">Declare New Services</h2>
                    {loadingServices ? (
                        <div>Loading services...</div>
                    ) : (
                        services.map((service) => (
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
                        ))
                    )}
                    <button
                        onClick={handleSaveServices}
                        className="save-button"
                        disabled={selectedServices.length === 0}
                    >
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
                        tileClassName={({ date, view }) =>
                            view === 'month' && isAvailable(date) ? 'calendar-available' : null
                        }
                    />
                    <button onClick={handleAddTimeSlot} className="calendar-button">
                        Add Time Slot on {selectedDate.toLocaleDateString()}
                    </button>
                </aside>
            </main>
            <Footer />
        </Layout>
    );
}
