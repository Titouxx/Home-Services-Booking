// src/components/Layout.jsx
import React from "react";
import Header from "./Header";

const Layout = ({ children, basketCount = 0 }) => {
    return (
        <div>
            <Header basketCount={basketCount} />
            <main>{children}</main>
            <footer style={footerStyle}>
                © All rights reserved
            </footer>
        </div>
    );
};

const footerStyle = {
    marginTop: "50px",
    textAlign: "center",
    fontSize: "12px",
    color: "#666",
};

export default Layout;
