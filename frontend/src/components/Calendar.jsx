import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/Calendar.css";

const AVAILABLE_HOURS = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];

const MyCalendar = ({ selectedService, onAddToBasket }) => {
  const [date, setDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedHour, setSelectedHour] = useState("");
  const [availabilities, setAvailabilities] = useState([]);
  const [reservations, setReservations] = useState([]);

  const handleBook = () => {
    if (!selectedService) {
      alert("❗ Please select a service before booking.");
      return;
    }
    setShowModal(true);
  };

  const confirmBooking = async () => {
    if (!selectedHour) {
      alert("❗ Please select a time slot.");
      return;
    }

    try {
      const fullDate = new Date(date);
      const [hour, minute] = selectedHour.split(":");
      fullDate.setHours(parseInt(hour, 10), parseInt(minute, 10));

      const payload = {
        serviceId: selectedService.service?.id || selectedService.id,
        appointmentDate: fullDate.toISOString(),
      };

      const user = JSON.parse(localStorage.getItem("user"));
      payload.userId = user?.id;

      if (selectedService.isSubService) {
        payload.customName = selectedService.name;
        payload.customDuration = selectedService.durationMinutes;
        payload.customPrice = selectedService.price;
      }

      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Booking failed");
      }

      // Parse response but don't need to store if not used
      await response.json();

      alert(
        `✅ Booked "${selectedService.name}" on ${fullDate.toLocaleString()}`
      );

      // Ensure addToBasket is properly passed and is a function
      if (typeof onAddToBasket === "function") {
        onAddToBasket({
          ...selectedService,
          date: fullDate,
          time: selectedHour,
        });
      }

      setShowModal(false);
      setSelectedHour("");
    } catch (err) {
      console.error("Booking error:", err);
      alert(`❌ Booking failed: ${err.message}`);
    }
  };

  useEffect(() => {
    if (selectedService) {
      fetch(`/api/provider/availability/by-service?serviceName=${encodeURIComponent(selectedService.name)}`)
        .then(res => res.json())
        .then(data => setAvailabilities(Array.isArray(data) ? data : []));
      fetch(`/api/reservations/by-service/${selectedService.id}`)
        .then(res => res.json())
        .then(data => setReservations(Array.isArray(data) ? data : []));
    } else {
      setAvailabilities([]);
      setReservations([]);
    }
  }, [selectedService]);

  // Get booked times for the selected date
  const bookedTimes = reservations
    .filter(r => new Date(r.appointmentDate).toDateString() === date.toDateString())
    .map(r => new Date(r.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));

  // Get available times for the selected date
  const availableTimesForDate = availabilities
    .filter(a => new Date(a.availableDate).toDateString() === date.toDateString())
    .map(a => {
      const d = new Date(a.availableDate);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    })
    .filter(time => !bookedTimes.includes(time));

  const noAvailabilities = selectedService && availabilities.length === 0;
  const noTimesForDate = selectedService && availableTimesForDate.length === 0;

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
        tileDisabled={({ date: d }) =>
          selectedService && availabilities.length > 0 &&
          !availabilities.some(a => new Date(a.availableDate).toDateString() === d.toDateString())
        }
      />

      <button
        className="calendar-button"
        onClick={handleBook}
        disabled={noAvailabilities}
      >
        Book on {date.toLocaleDateString()}
      </button>
      {noAvailabilities && (
        <div style={{ color: '#b00', marginTop: 10, fontWeight: 500 }}>
          No availability for this service
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h4>Select an available time</h4>
            {noTimesForDate ? (
              <div style={{ color: '#b00', marginBottom: 10 }}>
                No available times for this date
              </div>
            ) : null}
            <select
              value={selectedHour}
              onChange={(e) => setSelectedHour(e.target.value)}
              className="time-select"
              disabled={noTimesForDate}
            >
              <option value="">-- Choose a time --</option>
              {availableTimesForDate.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            <div className="modal-buttons">
              <button className="confirm" onClick={confirmBooking} disabled={noTimesForDate || !selectedHour}>
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
