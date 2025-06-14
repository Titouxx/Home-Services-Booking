import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/Calendar.css";

const AVAILABLE_HOURS = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];

function parseLocalDateTime(str) {
  if (!str) return null;
  let s = str.replace('T', ' ');
  const [datePart, timePart] = s.split(' ');
  if (!datePart || !timePart) return new Date(str);
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute, second] = timePart.split(':').map(Number);
  return new Date(year, month - 1, day, hour, minute, second);
}

const isSameDay = (d1, d2) =>
    d1 && d2 &&
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

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

    const slotsForHour = timeToAvailabilities[selectedHour] || [];
    const slot = slotsForHour.find(a => {
      const d = parseLocalDateTime(a.availableDate);
      return isSameDay(d, date) &&
          d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) === selectedHour &&
          !reservations.some(r =>
              isSameDay(parseLocalDateTime(r.appointmentDate), date) &&
              parseLocalDateTime(r.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) === selectedHour &&
              r.providerId === a.providerId
          );
    });

    if (!slot) {
      alert("No more availability for this time.");
      return;
    }

    try {
      const d = parseLocalDateTime(slot.availableDate);
      const pad = n => n.toString().padStart(2, '0');
      const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;

      const payload = {
        serviceId: selectedService.service?.id || selectedService.id,
        appointmentDate: dateStr,
        providerId: slot.providerId,
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

      await response.json();
      alert(`✅ Booked "${selectedService.name}" on ${dateStr}`);
      if (typeof onAddToBasket === "function") {
        onAddToBasket({ ...selectedService, date: d, time: selectedHour });
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

  const availableDays = availabilities.map(a => parseLocalDateTime(a.availableDate)).filter(Boolean);

  const tileDisabled = ({ date: d }) =>
      selectedService && availabilities.length > 0 &&
      !availableDays.some(availDate => isSameDay(availDate, d));

  const tileClassName = ({ date: d }) =>
      selectedService && availableDays.some(availDate => isSameDay(availDate, d))
          ? 'calendar-available'
          : null;

  const timeToAvailabilities = {};
  availabilities
      .filter(a => isSameDay(parseLocalDateTime(a.availableDate), date))
      .forEach(a => {
        const d = parseLocalDateTime(a.availableDate);
        const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        if (!timeToAvailabilities[timeStr]) timeToAvailabilities[timeStr] = [];
        timeToAvailabilities[timeStr].push(a);
      });

  const availableTimesForDate = Object.entries(timeToAvailabilities)
      .filter(([time, slots]) =>
          slots.some(a => {
            const d = parseLocalDateTime(a.availableDate);
            return !reservations.some(r =>
                isSameDay(parseLocalDateTime(r.appointmentDate), date) &&
                parseLocalDateTime(r.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) === time &&
                r.providerId === a.providerId
            );
          })
      )
      .map(([time]) => time);

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
            tileDisabled={tileDisabled}
            tileClassName={tileClassName}
        />

        <button
            className="calendar-button"
            onClick={handleBook}
            disabled={noAvailabilities}
        >
          Book on {date.toLocaleDateString('fr-FR')}
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
                {noTimesForDate && (
                    <div style={{ color: '#b00', marginBottom: 10 }}>
                      No available times for this date
                    </div>
                )}
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
                  <button className="confirm" onClick={confirmBooking} disabled={!selectedHour}>
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
