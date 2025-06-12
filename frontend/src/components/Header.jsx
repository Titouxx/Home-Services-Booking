import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css"; // ✅ Import CSS

const Header = ({ basketCount }) => {
    const navigate = useNavigate();

    return (
        <header className="header">
            <Link to="/" className="logo">PLANITY</Link>
            <nav className="header-nav">
                <Link to="/about">Who we are</Link>
                <Link to="/profile">My profile</Link>
                <button onClick={() => navigate("/basket")} className="basket-button">
                    Basket ({basketCount})
                </button>
            </nav>
        </header>
    );
};

export default Header;
