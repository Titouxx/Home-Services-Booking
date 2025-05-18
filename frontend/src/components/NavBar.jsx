import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

const NavBar = () => {
    return (
        <nav className="navbar">
            <div className="logo">
                <Link to="/" style={{ textDecoration: "none", color: "#4c6920" }}>
                    PLANITY
                </Link>
            </div>
            <ul className="nav-links">
                <li><a href="/templates/login.html">Who we are</a></li>
                <li><a href="/templates/login.html">My profile</a></li>
                <li>
                    <Link to="/basket">
                    <button className="basket">Basket (3)</button>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
