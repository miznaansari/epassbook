import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import './App.css';
import Login from './components/Login';
import SectionA from './components/SectionA';
import SectionB from './components/SectionB';
import SectionC from './components/SectionC';
import Signup from './components/Signup';
import AuthState from './context/AuthState';
import Navbar from "./components/Navbar";
import TxnState from "./context/TxnState";
import BottomNavbar from "./components/BottomNavbar";

// ✅ Define prop types for ProtectedRoute and PublicRoute
interface RouteProps {
  component: React.ReactElement;
}

const App: React.FC = () => {
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

// ✅ ProtectedRoute - Only allow access if user has a token
const ProtectedRoute: React.FC<RouteProps> = ({ component }) => {
  const token = localStorage.getItem("token");
  return token ? component : <Navigate to="/login" />;
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
