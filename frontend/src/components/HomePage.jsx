import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MyCalendar from "./Calendar";
import Footer from "./Footer";
import Layout from "./Layout";
import "../styles/HomePage.css";

export function HomePage() {
  const [services, setServices] = useState([]);
  const [subServices, setSubServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [basketItems, setBasketItems] = useState(() => {
    const saved = localStorage.getItem("basketItems");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error("Failed to fetch services:", err));

    fetch("/api/subservices/all")
      .then((res) => res.json())
      .then((data) => setSubServices(data))
      .catch((err) => console.error("Failed to fetch subservices:", err));
  }, []);

  useEffect(() => {
    localStorage.setItem("basketItems", JSON.stringify(basketItems));
  }, [basketItems]);

  const handleCardClick = (e, service) => {
    if (e.target.closest("button")) return;
    setSelectedService(service);
  };

  const handleBasketClick = () => {
    navigate("/basket");
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
    if (item.isSubService) {
      setBasketItems((prev) => {
        const updated = [
          ...prev,
          {
            id: Date.now(),
            customName: item.name,
            customPrice: item.price,
            customDuration: item.durationMinutes,
            appointmentDate: item.date || null,
          },
        ];
        localStorage.setItem("basketItems", JSON.stringify(updated));
        return updated;
      });
    } else {
      setBasketItems((prev) => {
        const updated = [
          ...prev,
          {
            ...item,
            id: Date.now(),
          },
        ];
        localStorage.setItem("basketItems", JSON.stringify(updated));
        return updated;
      });
    }
  };

  const matchingServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const matchingSubServices = subServices.filter(sub =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <main className="home-main">
        <section className="service-list">
          <div className="section-title-with-search">
            <h2>Our Services</h2>
            <input
              type="text"
              className="search-input"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <hr />

          {searchQuery ? (
            <>
              {/* Show matched services only */}
              {matchingServices.map((service) => (
                <div
                  key={service.id}
                  onClick={(e) => handleCardClick(e, service)}
                  className={`service-card${selectedService?.id === service.id ? " selected" : ""}`}
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

              {/* Show matched subservices only */}
              {matchingSubServices.map((sub) => (
                <div
                  key={sub.id}
                  className={`service-card${selectedService?.id === sub.id && selectedService?.isSubService ? " selected" : ""}`}
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
          ) : (
            services.map((service) => (
              <div
                key={service.id}
                onClick={(e) => handleCardClick(e, service)}
                className={`service-card${selectedService?.id === service.id ? " selected" : ""}`}
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
      <Footer />
    </Layout>
  );
}
