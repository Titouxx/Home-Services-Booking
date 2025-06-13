import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/Calendar.css";

const AVAILABLE_HOURS = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];

const MyCalendar = ({ selectedService, addToBasket }) => {
    const [date, setDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [selectedHour, setSelectedHour] = useState("");

    const handleBook = () => {
        if (!selectedService) {
            alert("❗ Please select a service before booking.");
            return;
        }
        setShowModal(true);
    };

    const confirmBooking = () => {
        if (!selectedHour) {
            alert("❗ Please select a time slot.");
            return;
        }

        const fullDate = new Date(date);
        const [hour, minute] = selectedHour.split(":");
        fullDate.setHours(hour, minute);

        const payload = {
            serviceId: selectedService.service?.id || selectedService.id,
            appointmentDate: fullDate,
        };

        if (selectedService.isSubService) {
            payload.customName = selectedService.name;
            payload.customDuration = selectedService.durationMinutes;
            payload.customPrice = selectedService.price;
        }

        fetch("/api/reservations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Booking failed");
                return res.json();
            })
            .then((data) => {
                alert(`✅ Booked "${selectedService.name}" on ${fullDate.toLocaleString()}`);
                addToBasket({
                    ...selectedService,
                    date: fullDate,
                    time: selectedHour,
                });
                setShowModal(false);
                setSelectedHour("");
            })
            .catch((err) => {
                alert("❌ Booking failed. Try again.");
                console.error(err);
            });
    };


    return (
        <div className="calendar">
            <h3>Calendar</h3>

            {selectedService ? (
                <p style={{ color: "#4c6920", fontWeight: "bold" }}>
                    Selected Service: {selectedService.name}
                </p>
            ) : (
                <p style={{ color: "#888" }}>Please select a service</p>
            )}

            <Calendar
                onChange={setDate}
                value={date}
                minDate={new Date()}
                className="custom-calendar"
            />

            <button className="calendar-button" onClick={handleBook}>
                Book on {date.toLocaleDateString()}
            </button>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h4>Select an available time</h4>
                        <select
                            value={selectedHour}
                            onChange={(e) => setSelectedHour(e.target.value)}
                            className="time-select"
                        >
                            <option value="">-- Choose a time --</option>
                            {AVAILABLE_HOURS.map((time) => (
                                <option key={time} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                        <div className="modal-buttons">
                            <button className="confirm" onClick={confirmBooking}>
                                Confirm
                            </button>
                            <button className="cancel" onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyCalendar;
