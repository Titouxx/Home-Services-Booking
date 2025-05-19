import React from "react";
import "../styles/navbar.css";

const NavBar = () => {
    return (
        <nav className="navbar">
            <div className="logo">PLANITY</div>
            <ul className="nav-links">
                <li><a href="/auth/login">Who we are</a></li>
                <li><a href="/auth/login">My profile</a></li>
                <li><button className="basket">Basket</button></li>
            </ul>
        </nav>
    );
};

export default NavBar;
