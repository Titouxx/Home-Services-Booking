// Fichier : src/main/resources/static/react-ui/components/ServiceCard.js
import React from "react";
import "../styles/serviceCard.css";

const ServiceCard = ({ icon, name, price }) => {
    return (
        <div className="service-card">
            <div className="service-content">
                <div className="service-icon">
                    <img src={icon} alt={name} />
                </div>
                <div className="service-info">
                    <strong>{name}</strong>
                    <p>{price} € / 1h</p>
                </div>
            </div>
            <button className="service-btn">Details</button>
        </div>
    );
};

export default ServiceCard;
