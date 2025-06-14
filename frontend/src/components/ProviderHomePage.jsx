// src/components/ProviderHomePage.jsx
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/ProviderHomePage.css";
import Layout from "./Layout";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const AVAILABLE_HOURS = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];

export function ProviderHomePage() {
    const [services, setServices] = useState([]);
    const [subServices, setSubServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [timeSlots, setTimeSlots] = useState([]);
    const [loadingServices, setLoadingServices] = useState(true);
    const [selectedServiceNames, setSelectedServiceNames] = useState([]);
    const [selectedServiceForAvailability, setSelectedServiceForAvailability] = useState("");
    const [showServiceSelector, setShowServiceSelector] = useState(false);
    const [selectedTime, setSelectedTime] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));
    const providerId = user?.id;
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !providerId) {
            alert("You must be logged in as a provider.");
            window.location.href = "/login";
        }
        fetch("/api/services")
            .then((res) => res.json())
            .then(setServices)
            .catch((err) => console.error("Failed to load services", err))
            .finally(() => setLoadingServices(false));

        fetch("/api/subservices/all")
            .then((res) => res.json())
            .then(setSubServices)
            .catch(() => {});

        fetch(`/api/provider/availability?providerId=${providerId}`)
            .then((res) => res.json())
            .then(setTimeSlots)
            .catch(() => {});

        fetch(`/api/provider/services?providerId=${providerId}`)
            .then((res) => res.json())
            .then(data => {
                const names = data.map(s => s.serviceName);
                setSelectedServiceNames(names);
                setSelectedServices(names);
            })
            .catch(() => {});
    }, []);

    // Service selection logic
    const handleServiceChange = (name) => {
        setSelectedServices((prev) =>
            prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
        );
    };

    // Subservice selection logic
    const handleSubServiceChange = (name) => {
        setSelectedServices((prev) =>
            prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
        );
    };

    const handleSaveServices = async () => {
        if (selectedServices.length === 0) {
            alert("Please select at least one service or subservice.");
            return;
        }
        try {
            const res = await fetch("/api/provider/services", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ providerId, serviceNames: selectedServices }),
            });
            if (!res.ok) throw new Error("Failed to save services");
            setSelectedServiceNames(selectedServices);
            setSelectedServiceForAvailability("");
            setShowServiceSelector(false);
            alert("✅ Services saved!");
        } catch (err) {
            alert("❌ Error: " + err.message);
        }
    };

    const handleAddTimeSlot = async () => {
        const serviceName = selectedServiceNames.length === 1
            ? selectedServiceNames[0]
            : selectedServiceForAvailability;

        if (!serviceName) {
            alert("Please select a service.");
            return;
        }
        if (!selectedTime) {
            alert("Please select a time.");
            return;
        }

        // Combine date and time
        const date = new Date(selectedDate);
        const [hour, minute] = selectedTime.split(":");
        date.setHours(parseInt(hour, 10), parseInt(minute, 10), 0, 0);
        const pad = n => n.toString().padStart(2, '0');
        const dateStr = `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;

        if (timeSlots.some(slot => slot.availableDate.startsWith(dateStr.slice(0, 16)) && slot.serviceName === serviceName)) {
            alert("This time slot for this service is already added.");
            return;
        }

        try {
            const res = await fetch("/api/provider/availability", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ providerId, date: dateStr, serviceName }),
            });
            if (!res.ok) throw new Error("Failed to add time slot");
            fetch(`/api/provider/availability?providerId=${providerId}`)
                .then((res) => res.json())
                .then(setTimeSlots)
                .catch(() => {});
            alert(`Time slot added for ${date.toLocaleString()} (${serviceName})`);
            setSelectedTime(""); // Reset after adding
        } catch (err) {
            alert("❌ Error: " + err.message);
        }
    };

    const isSameDay = (d1, d2) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

    const isAvailable = (date) => {
        const serviceName = selectedServices.length === 1
            ? selectedServices[0]
            : selectedServiceForAvailability;

        return timeSlots.some(slot => {
            const slotDate = new Date(slot.availableDate.replace(" ", "T"));
            return isSameDay(slotDate, date) && slot.serviceName === serviceName;
        });
    };


    const groupedAvailabilities = selectedServices.reduce((acc, service) => {
        acc[service] = timeSlots.filter(slot => slot.serviceName === service);
        return acc;
    }, {});

    const calendarDisabled = selectedServices.length === 0 ||
        (selectedServices.length > 1 && !selectedServiceForAvailability);

    return (
        <Layout>
            <main className="provider-main" style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
                <section style={{ flex: 1 }}>
                    <div className="provider-section-title" style={{ fontSize: "1.5rem", color: "#4B6000", marginBottom: 20 }}>
                        You are a provider in service: <span style={{ fontWeight: "bold" }}>{selectedServiceNames.join(", ") || "None"}</span>
                    </div>
                    <hr style={{ border: 'none', borderTop: '1.5px solid #dbe6c2', margin: '0 0 24px 0' }} />
                    <div className="provider-card" style={{ background: "#f6faee", color: "#4B6000", marginBottom: 20, fontSize: "1rem" }}>
                        <div style={{ fontWeight: "bold", marginBottom: 8 }}>Your availabilities</div>
                        {Object.entries(groupedAvailabilities).map(([service, slots]) => (
                            <div key={service} style={{ marginBottom: 8 }}>
                                <div style={{ fontWeight: 500 }}>{service}</div>
                                {slots.length === 0
                                    ? <div style={{ color: "#888" }}>No availability</div>
                                    : (
                                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                                            {slots.map(slot => (
                                                <li key={slot.availableDate} style={{ fontSize: "0.98em" }}>
                                                    {new Date(slot.availableDate.replace(' ', 'T')).toLocaleString()}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                            </div>
                        ))}
                    </div>
                    <button
                        className="provider-btn"
                        style={{ marginBottom: 18 }}
                        onClick={() => navigate("/appointments")}
                    >
                        Go to appointments
                    </button>
                    <button
                        className="provider-btn"
                        style={{ background: "#fff", color: "#4B6000", border: "1.5px solid #4B6000" }}
                        onClick={() => setShowServiceSelector(v => !v)}
                    >
                        Change my service
                    </button>
                    {showServiceSelector && (
                        <div className="provider-card" style={{ marginTop: 18, background: "#f6faee", color: "#4B6000" }}>
                            <div style={{ fontWeight: "bold", marginBottom: 8 }}>Select your services and subservices</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                                {services.map(service => (
                                    <button
                                        key={service.name}
                                        onClick={() => handleServiceChange(service.name)}
                                        className={`provider-tag ${selectedServices.includes(service.name) ? "selected" : ""}`}
                                    >
                                        {service.name}
                                    </button>
                                ))}
                                {subServices.map(sub => (
                                    <button
                                        key={sub.name}
                                        onClick={() => handleSubServiceChange(sub.name)}
                                        className={`provider-tag ${selectedServices.includes(sub.name) ? "selected" : ""}`}
                                    >
                                        {sub.name}
                                    </button>
                                ))}
                            </div>
                            <button
                                className="provider-btn"
                                style={{ marginTop: 12 }}
                                onClick={handleSaveServices}
                                disabled={selectedServices.length === 0}
                            >
                                Save my selection
                            </button>
                        </div>
                    )}
                </section>
                <aside className="provider-calendar" style={{ minWidth: 340 }}>
                    <div className="provider-section-title" style={{ fontSize: "1.2rem", color: "#4B6000", marginBottom: 10 }}>
                        Add Availability
                    </div>
                    {selectedServices.length > 1 && (
                        <select
                            className="provider-dropdown"
                            value={selectedServiceForAvailability}
                            onChange={e => setSelectedServiceForAvailability(e.target.value)}
                            style={{ marginBottom: 10 }}
                        >
                            <option value="">-- Choose a service --</option>
                            {selectedServices.map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                    )}
                    <div className="provider-card" style={{ background: "#f6faee", color: "#4B6000", flexDirection: "column", alignItems: "stretch", minWidth: 0 }}>
                        <Calendar
                            onChange={setSelectedDate}
                            value={selectedDate}
                            minDate={new Date()}
                            className="custom-calendar"
                            tileClassName={({ date, view }) =>
                                view === 'month' && isAvailable(date) ? 'calendar-available' : null
                            }
                            disabled={calendarDisabled}
                        />
                        <div style={{ margin: "15px 0" }}>
                            <label style={{ fontWeight: 500, color: "#4B6000" }}>Select a time:</label>
                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
                                {AVAILABLE_HOURS.map((hour) => (
                                    <button
                                        key={hour}
                                        type="button"
                                        className={`provider-tag ${selectedTime === hour ? "selected" : ""}`}
                                        onClick={() => setSelectedTime(hour)}
                                    >
                                        {hour}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={handleAddTimeSlot}
                            className="provider-btn"
                            style={{ marginTop: 18 }}
                            disabled={calendarDisabled || !selectedTime}
                        >
                            Add Slot for {selectedDate.toLocaleDateString()} {selectedTime && `at ${selectedTime}`}
                        </button>
                    </div>
                </aside>
            </main>
            <Footer />
        </Layout>
    );
}
