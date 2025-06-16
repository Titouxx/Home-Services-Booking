import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import MyCalendar from "./Calendar";
import Layout from "./Layout";
import "../styles/HomePage.css";

export function HomePage() {
  const [services, setServices] = useState([]);
  const [subServices, setSubServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState("services");
  const [bookings, setBookings] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [basketItems, setBasketItems] = useState(() => {
    const saved = localStorage.getItem("basketItems");
    return saved ? JSON.parse(saved) : [];
  });

  const dropdownRef = useRef(null);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then(setServices)
      .catch((err) => console.error("Failed to fetch services:", err));

    fetch("/api/subservices/all")
      .then((res) => res.json())
      .then(setSubServices)
      .catch((err) => console.error("Failed to fetch subservices:", err));
  }, []);

  useEffect(() => {
    localStorage.setItem("basketItems", JSON.stringify(basketItems));
  }, [basketItems]);

  useEffect(() => {
    if (searchMode === "reservations") {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id) return;
      fetch(`/api/reservations/by-user/${user.id}`)
        .then((res) => res.json())
        .then(setBookings)
        .catch((err) => console.error("Failed to fetch bookings:", err));
    } else if (searchMode === "availability") {
      fetch("/api/provider/availability/all")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setAvailabilities(data);
          } else {
            console.error("Unexpected availabilities response:", data);
            setAvailabilities([]);
          }
        })
        .catch((err) => console.error("Failed to fetch availabilities:", err));
    }
  }, [searchMode]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCardClick = (e, service) => {
    if (e.target.closest("button")) return;
    setSelectedService(service);
  };

  const handleSubServiceClick = (sub) => {
    setSelectedService({
      ...sub,
      isSubService: true,
      name: sub.name,
      price: sub.price,
      durationMinutes: sub.duration_minutes,
    });
  };

  const handleAddToBasket = (item) => {
    const updated = [
      ...basketItems,
      item.isSubService
        ? {
            id: Date.now(),
            customName: item.name,
            customPrice: item.price,
            customDuration: item.durationMinutes,
            appointmentDate: item.date || null,
          }
        : { ...item, id: Date.now() },
    ];
    setBasketItems(updated);
    localStorage.setItem("basketItems", JSON.stringify(updated));
  };

  const matchingServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const matchingSubServices = subServices.filter((sub) =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBookings = bookings.filter(
    (b) =>
      b.service?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAvailabilities = Array.isArray(availabilities)
    ? availabilities.filter((a) =>
        new Date(a.availableDate)
          .toLocaleDateString("fr-FR")
          .includes(searchQuery.trim())
      )
    : [];

  return (
    <Layout>
      <main className="home-main">
        <section className="service-list">
          <div className="section-title-with-search">
            <h2>Our Services</h2>
            <div className="search-with-filter">
              <input
                type="text"
                className="search-input"
                placeholder={
                  searchMode === "services"
                    ? "Search services..."
                    : searchMode === "reservations"
                    ? "Search your bookings..."
                    : "Search by availability..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="search-filter-dropdown" ref={dropdownRef}>
                <button
                  className="dropdown-toggle"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                >
                  ▼
                </button>
                {isDropdownOpen && (
                  <ul className="dropdown-menu">
                    <li
                      onClick={() => {
                        setSearchMode("services");
                        setIsDropdownOpen(false);
                      }}
                      className={searchMode === "services" ? "active" : ""}
                    >
                      Services & Subservices
                    </li>
                    <li
                      onClick={() => {
                        setSearchMode("reservations");
                        setIsDropdownOpen(false);
                      }}
                      className={searchMode === "reservations" ? "active" : ""}
                    >
                      My Reservations
                    </li>
                    <li
                      onClick={() => {
                        setSearchMode("availability");
                        setIsDropdownOpen(false);
                      }}
                      className={searchMode === "availability" ? "active" : ""}
                    >
                      Availability by Date
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
          <hr />

          {searchQuery && searchMode === "services" ? (
            <>
              {matchingServices.map((service) => (
                <div
                  key={service.id}
                  onClick={(e) => handleCardClick(e, service)}
                  className={`service-card${
                    selectedService?.id === service.id ? " selected" : ""
                  }`}
                >
                  <div>
                    <h3>🔧 {service.name}</h3>
                    <p style={{ color: "#4B6000" }}>
                      {service.price}€ / {service.durationMinutes}min
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Link
                      to={`/services/${service.id}`}
                      className="details-button"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))}
              {matchingSubServices.map((sub) => (
                <div
                  key={sub.id}
                  className={`service-card${
                    selectedService?.id === sub.id &&
                    selectedService?.isSubService
                      ? " selected"
                      : ""
                  }`}
                  onClick={() => handleSubServiceClick(sub)}
                >
                  <div>
                    <h4>{sub.name}</h4>
                    <p style={{ color: "#4B6000" }}>
                      {sub.price}€ / {sub.duration_minutes}min
                    </p>
                  </div>
                </div>
              ))}
            </>
          ) : searchQuery && searchMode === "reservations" ? (
            filteredBookings.length === 0 ? (
              <p style={{ color: "#888", marginTop: 10 }}>
                No bookings matched your search.
              </p>
            ) : (
              filteredBookings.map((b) => (
                <div key={b.id} className="service-card">
                  <div>
                    <h4>{b.customName || b.service?.name}</h4>
                    <p style={{ color: "#4B6000" }}>
                      {(b.customPrice ?? b.service?.price) + "€"} /{" "}
                      {(b.customDuration ?? b.service?.durationMinutes) + "min"}
                    </p>
                    <p>
                      Date:{" "}
                      {new Date(b.appointmentDate).toLocaleDateString("fr-FR")}{" "}
                      <br />
                      Time:{" "}
                      {new Date(b.appointmentDate).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <Link
                    to={`/message?providerId=${b.providerId}`}
                    className="details-button"
                  >
                    Message Provider
                  </Link>
                </div>
              ))
            )
          ) : searchQuery && searchMode === "availability" ? (
            filteredAvailabilities.length === 0 ? (
              <p style={{ color: "#888", marginTop: 10 }}>
                No availabilities match this date.
              </p>
            ) : (
              filteredAvailabilities.map((a, i) => (
                <div key={i} className="service-card">
                  <div>
                    <h4>{a.serviceName}</h4>
                    <p>
                      Date:{" "}
                      {new Date(a.availableDate).toLocaleDateString("fr-FR")}{" "}
                      <br />
                      Time:{" "}
                      {new Date(a.availableDate).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )
          ) : (
            services.map((service) => (
              <div
                key={service.id}
                onClick={(e) => handleCardClick(e, service)}
                className={`service-card${
                  selectedService?.id === service.id ? " selected" : ""
                }`}
              >
                <div>
                  <h3>🔧 {service.name}</h3>
                  <p style={{ color: "#4B6000" }}>
                    {service.price}€ / {service.durationMinutes}min
                  </p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <Link
                    to={`/services/${service.id}`}
                    className="details-button"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </section>

        <aside className="calendar-card">
          <MyCalendar
            selectedService={selectedService}
            onAddToBasket={handleAddToBasket}
          />
        </aside>
      </main>
    </Layout>
  );
}
