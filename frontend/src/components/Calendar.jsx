import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/calendar.css"; // Assure-toi que ce fichier contient les styles ci-dessous

const MyCalendar = () => {
    const [date, setDate] = useState(new Date());

    return (
        <div className="calendar">
            <h3>Calendar</h3>
            <Calendar
                onChange={setDate}
                value={date}
                minDate={new Date()}
                className="react-calendar"
                tileClassName="calendar-tile"
            />
            <button className="calendar-button">
                Book on {date.toLocaleDateString()}
            </button>
        </div>
    );
};

export default MyCalendar;
