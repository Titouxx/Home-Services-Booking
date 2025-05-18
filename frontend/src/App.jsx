import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./components/HomePage.jsx";
import ServiceDetailsPage from "./components/ServiceDetailsPage";
import TermsPage from "./components/TermsPage";
import BasketPage from "./components/BasketPage";
import NavBar from "./components/NavBar";


function App() {
  return (
  <BrowserRouter>
    <NavBar />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/services/:id" element={<ServiceDetailsPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/basket" element={<BasketPage />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
