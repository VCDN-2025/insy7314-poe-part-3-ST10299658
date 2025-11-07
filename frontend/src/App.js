import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import PaymentsPage from "./pages/PaymentsPage.jsx";
import EmployeeDashboardPage from "./pages/EmployeeDashboardPage.jsx";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ManageEmployees from "./pages/admin/ManageEmployees";
import ManageTransactions from "./pages/admin/ManageTransactions";
import AdminLogin from "./components/AdminLogin";


import { getProtected } from "./services/api";

// Global styles
Object.assign(document.body.style, {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  margin: 0,
  padding: 0,
  backgroundColor: "#f8f9fa",
  lineHeight: 1.6,
});

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Skip protected auth check for testing
  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontSize: "1.5rem", color: "#7f8c8d" }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Admin login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/employees" element={<ManageEmployees />} />
        <Route path="/admin/transactions" element={<ManageTransactions />} />

        {/* Employee dashboard */}
        <Route path="/employee-dashboard" element={<EmployeeDashboardPage />} />

        {/* Main layout */}
        <Route path="/" element={<Layout loggedIn={loggedIn} user={user} setLoggedIn={setLoggedIn} setUser={setUser} />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          {/* Customer pages */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="make-payment" element={<PaymentPage />} />
          <Route path="payments" element={<PaymentsPage />} />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div style={{ textAlign: "center", padding: "3rem", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", margin: "2rem" }}>
                <h1 style={{ color: "#e74c3c" }}>404 - Page Not Found</h1>
                <p style={{ color: "#7f8c8d" }}>The page you're looking for doesn't exist.</p>
              </div>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
