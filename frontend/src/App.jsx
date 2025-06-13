import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./components/HomePage.jsx";
import ServiceDetailsPage from "./components/ServiceDetailsPage";
import TermsPage from "./components/TermsPage";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import { BasketPage } from "./components/BasketPage.jsx";
import { ProviderHomePage } from "./components/ProviderHomePage";
import AboutPage from "./components/AboutPage";
import MyAppointments from "./components/MyAppointments";
import MessagingPage from "./components/MessagingPage";
import ProviderReviewPage from "./components/ProviderReviewPage";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/terms" element={<TermsPage />} />

        {/* Pages protégées (nécessitent authentification) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/services/:id"
          element={
            <ProtectedRoute>
              <ServiceDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/basket"
          element={
            <ProtectedRoute>
              <BasketPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider-dashboard"
          element={
            <ProtectedRoute>
              <ProviderHomePage />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/my-appointments" 
          element={
            <MyAppointments />
          } 
        />

        <Route
          path="/messages" 
          element={
            <MessagingPage />
          } 
        />

        <Route 
          path="/provider/:providerId/reviews" 
          element={
            <ProviderReviewPage />
          } 
        />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
