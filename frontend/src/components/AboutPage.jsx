// src/components/AboutPage.jsx
import React from "react";
import Layout from "./Layout";
import Footer from "./Footer";
import "../styles/AboutPage.css";


const AboutPage = () => {
    return (
        <Layout>
            <div className="about-container">
                <div className="about-card">
                    <h1 className="about-title">Who We Are</h1>
                    <p className="about-text">
                        <strong>PLANITY</strong> is a modern digital platform designed to simplify home service bookings.
                        Our goal is to make it effortless for individuals to find, compare, and book trusted professionals —
                        whether they need a plumber, electrician, or cleaning service — all from one place.
                    </p>
                </div>

                <div className="about-card">
                    <h2 className="about-subtitle">Our Mission</h2>
                    <p className="about-text">
                        We aim to connect clients with skilled service providers quickly, transparently, and securely.
                        No more endless phone calls or vague pricing — PLANITY brings clarity and convenience.
                    </p>
                </div>

                <div className="about-card">
                    <h2 className="about-subtitle">What This Tool Does</h2>
                    <ul className="about-list">
                        <li>📅 Browse available services and professionals</li>
                        <li>🛒 Book appointments with a few clicks</li>
                        <li>👔 Providers can manage availability and services</li>
                        <li>🔐 Secure and user-friendly interface for both clients and providers</li>
                    </ul>
                </div>

                <div className="about-card">
                    <h2 className="about-subtitle">Why PLANITY?</h2>
                    <p className="about-text">
                        We believe in saving your time and simplifying life. Whether you're a busy parent, a remote worker,
                        or someone managing multiple properties — PLANITY is your partner for hassle-free service management.
                    </p>
                </div>
            </div>
            <Footer />
            </Layout>
    );
};
export default AboutPage;

