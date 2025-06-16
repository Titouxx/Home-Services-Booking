import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MyCalendar from "./Calendar";
import "../styles/ServiceDetailsPage.css";
import Layout from "./Layout";

const ServiceDetailsPage = () => {
  const { id } = useParams();
  const [subServices, setSubServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubService, setSelectedSubService] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    fetch(`/api/subservices?serviceId=${id}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Sous-services non trouvés");
        return res.json();
      })
      .then((data) => {
        setSubServices(data.slice(0, 3));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleBookClick = () => {
    if (!selectedSubService) {
      alert("Veuillez sélectionner un sous-service.");
      return;
    }
    setShowCalendar(true);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="service-container">
      <Layout>
        <div className="content-container">
          <div className="header-section">
            <h2 className="section-title">Sub-services</h2>
            <button onClick={handleBookClick} className="book-btn">
              Book
            </button>
          </div>

          <div className="subservices-grid">
            {subServices.map((sub) => (
              <div
                key={sub.id}
                onClick={() => setSelectedSubService(sub)}
                className={`subservice-card ${
                  selectedSubService?.id === sub.id ? "selected" : ""
                }`}
              >
                <h3 className="subservice-title">🔧 {sub.name}</h3>
                <p>
                  <strong className="price-text">Prix :</strong> {sub.price} € /{" "}
                  {sub.duration_minutes} minutes
                </p>
                <div className="description-box">{sub.description}</div>
              </div>
            ))}
          </div>

          {showCalendar && (
            <div
              className="modal-overlay"
              onClick={() => setShowCalendar(false)}
            >
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <MyCalendar selectedService={selectedSubService} />
              </div>
            </div>
          )}
        </div>
      </Layout>
    </div>
  );
};

export default ServiceDetailsPage;
