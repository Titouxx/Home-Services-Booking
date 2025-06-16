import { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";
import { useNavigate } from "react-router-dom";

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/services", {
      method: "GET",
      credentials: "include",
    })
      .then(async (res) => {
        if (res.status === 401 || res.status === 403) {
          console.warn("🚫 Accès refusé, redirection vers login");
          navigate("/login");
          return null;
        }
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Erreur ${res.status} : ${text}`);
        }
        const text = await res.text();
        if (!text) throw new Error("Réponse vide reçue du serveur.");
        return JSON.parse(text);
      })
      .then((data) => {
        if (data) setServices(data);
      })
      .catch((err) => {
        console.error("❌ Erreur récupération services :", err.message);
        setError("Impossible de récupérer les services.");
      });
  }, [navigate]);

  return (
    <div className="service-list">
      {error && <p style={{ color: "red" }}>{error}</p>}
      {services.length > 0 ? (
        services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))
      ) : (
        <p>Aucun service disponible.</p>
      )}
    </div>
  );
};

export default ServiceList;
