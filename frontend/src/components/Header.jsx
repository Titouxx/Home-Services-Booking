import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css"; // ✅ Import CSS

const Header = ({ basketCount }) => {
    const navigate = useNavigate();

    return (
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px" }}>
            <Link to="/" style={{ color: "#4B6000", textDecoration: "none", fontSize: "2rem", fontWeight: "bold", fontFamily: "Georgia, serif" }}>
                PLANITY
            </Link>
            <nav>
                <Link to="/about" style={{ marginRight: "15px", textDecoration: "none", color: "#4B6000", fontWeight: "bold" }}>
                    Who we are
                </Link>
                <Link to="/profile" style={{ marginRight: "15px", textDecoration: "none", color: "#4B6000", fontWeight: "bold" }}>
                    My profile
                </Link>
               {/* <Link to="/provider-dashboard" style={{ marginRight: "15px", textDecoration: "none", color: "#4B6000", fontWeight: "bold" }}>
                    Provider Dashboard
                </Link>*/}
                <button 
                    onClick={() => navigate("/basket")} 
                    style={{ 
                        background: "#4B6000", 
                        color: "white", 
                        border: "none", 
                        padding: "6px 12px", 
                        borderRadius: "5px", 
                        cursor: "pointer" 
                    }}
                >
                    Basket ({basketCount})
                </button>
            </nav>
        </header>
    );
};

export default Header;
