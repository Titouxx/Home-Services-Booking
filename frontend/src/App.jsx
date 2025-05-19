import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./components/HomePage.jsx";
import ServiceDetailsPage from "./components/ServiceDetailsPage";
import TermsPage from "./components/TermsPage";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Pages publiques */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/terms" element={<TermsPage />} />

                {/* Pages protégées */}
                <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                <Route path="/services/:id" element={<ProtectedRoute><ServiceDetailsPage /></ProtectedRoute>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
