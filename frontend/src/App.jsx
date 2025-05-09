import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {HomePage} from "./components/HomePage.jsx";
import ServiceDetailsPage from "./components/ServiceDetailsPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/services/:id" element={<ServiceDetailsPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
