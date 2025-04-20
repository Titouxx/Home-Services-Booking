// src/main/resources/static/react-ui/components/ServiceList.js

import React from "react";
import { Link } from "react-router-dom";
import ServiceCard from "./ServiceCard";

const services = [
    {
        id: 1,
        name: "House cleaning",
        icon: "https://cdn-icons-png.flaticon.com/512/1946/1946406.png",
        price: 5.99,
    },
    {
        id: 2,
        name: "Plumber",
        icon: "https://cdn-icons-png.flaticon.com/512/2965/2965567.png",
        price: 5.99,
    },
    {
        id: 3,
        name: "Electrician",
        icon: "https://cdn-icons-png.flaticon.com/512/1853/1853587.png",
        price: 5.99,
    },
];

const ServiceList = () => {
    return (
        <div>
            {services.map((service) => (
                <Link key={service.id} to={`/services/${service.id}`} style={{ textDecoration: "none" }}>
                    <ServiceCard icon={service.icon} name={service.name} price={service.price} />
                </Link>
            ))}
        </div>
    );
};

export default ServiceList;
