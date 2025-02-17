import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { useEffect } from "react";
import './App.css';
import Login from './components/Login';
import SectionA from './components/SectionA';
import SectionB from './components/SectionB';
import SectionC from './components/SectionC';
import Signup from './components/Signup';
import AuthState from './context/AuthState';
import TxnState from "./context/TxnState";
import BottomNavbar from "./components/BottomNavbar";

// ✅ Define prop types for ProtectedRoute and PublicRoute
interface RouteProps {
  component: React.ReactElement;
}

const App: React.FC = () => {
  useEffect(() => {
    // Check token expiry on app load
    const token = localStorage.getItem("token");
    if (token) {
      const parsedToken = JSON.parse(token);
      const expiry = parsedToken?.expiry || 0;
      if (Date.now() > expiry) {
        // If token expired, remove it and redirect to login
        localStorage.removeItem("token");
      }
    }
  }, []);

  return (
    <AuthState>
      <TxnState>
        <Router>
          {/* <Navbar /> */}
          <Routes>
            {/* Public Routes - Redirect to MainSections if already logged in */}
            <Route path="/login" element={<PublicRoute component={<Login />} />} />
            <Route path="/signup" element={<PublicRoute component={<Signup />} />} />

            {/* Protected Route - Redirect to login if not authenticated */}
            <Route path="/*" element={<ProtectedRoute component={<MainSections />} />} />
          </Routes>
          <BottomNavbar />
        </Router>
      </TxnState>
    </AuthState>
  );
};

// ✅ ProtectedRoute - Only allow access if user has a valid token
const ProtectedRoute: React.FC<RouteProps> = ({ component }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  // Check token expiry
  const parsedToken = JSON.parse(token);
  const expiry = parsedToken?.expiry || 0;
  if (Date.now() > expiry) {
    // If expired, remove token and redirect to login
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }

  return component;
};

// ✅ PublicRoute - Prevent logged-in users from accessing login/signup
const PublicRoute: React.FC<RouteProps> = ({ component }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/" /> : component;
};

// ✅ MainSections Component
const MainSections: React.FC = () => {
  return (
    <>
      <SectionA />
      <SectionB />
      <SectionC />
    </>
  );
};

export default App;
