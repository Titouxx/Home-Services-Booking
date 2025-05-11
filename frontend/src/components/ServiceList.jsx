import React, { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";

const ServiceList = () => {
    const [services, setServices] = useState([]);

    useEffect(() => {
        fetch("/api/services")
            .then((res) => res.json())
            .then((data) => setServices(data))
            .catch((err) => console.error("Error fetching services:", err));
    }, []);

    return (
        <div className="service-list">
            {services.map(service => (
                <ServiceCard key={service.id} service={service} />
            ))}
        </div>
    );
};

export default ServiceList;
