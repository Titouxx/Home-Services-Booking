import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./components/HomePage.jsx";
import ServiceDetailsPage from "./components/ServiceDetailsPage";
import TermsPage from "./components/TermsPage";
import AboutPage from "./components/AboutPage";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import { BasketPage } from "./components/BasketPage.jsx";
import { ProviderHomePage } from "./components/ProviderHomePage";
import MyAppointments from "./components/MyAppointments";
import MessagingPage from "./components/MessagingPage";
import ProviderReviewPage from "./components/ProviderReviewPage";
import ProfilePage from "./components/ProfilePage";
import AdminPage from "./components/AdminPage.jsx";
import ReviewListPage from "./components/ReviewListPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/about" element={<AboutPage />} />
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
          path="/appointments"
          element={
            <ProtectedRoute>
              <MyAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-appointments"
          element={
            <ProtectedRoute>
              <MyAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages/:otherUserId"
          element={
            <ProtectedRoute>
              <MessagingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/message"
          element={
            <ProtectedRoute>
              <MessagingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/:providerId/reviews"
          element={
            <ProtectedRoute>
              <ProviderReviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <AboutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviews"
          element={
            <ProtectedRoute>
              <ReviewListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviews/:providerId"
          element={
            <ProtectedRoute>
              <ProviderReviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/:providerId/reviews"
          element={
            <ProtectedRoute>
              <ProviderReviewPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
