import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children, basketCount = 0, isAdmin = false }) => {
  return (
    <div>
      <Header basketCount={basketCount} />
      <main>{children}</main>
      <Footer isAdmin={isAdmin} />
    </div>
  );
};
export default Layout;
