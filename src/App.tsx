import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import "./App.css";
import SectionA from "./components/SectionA";
import SectionB from "./components/SectionB";
import SectionC from "./components/SectionC";
import AuthState from "./context/AuthState";
import TxnState from "./context/TxnState";
import QuickState from "./context/QuickState";
import axios from "axios";
import BottomNavbar from "./components/BottomNavbar";

// 🔹 Protected Routes Component (Handles Authentication)
const ProtectedRoutes: React.FC = () => {
  const navigate = useNavigate();
  const [token] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const tokencheck = async () => {
      try {
        const response = await axios.post(
          "https://epassbook.onrender.com/checktoken",
          {},
          { headers: { Authorization: token } }
        );

        if (response.data.error) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Token validation failed", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    tokencheck();
  }, [navigate, token]);

  return (
    <>
      <SectionA />
      <SectionB />
      <SectionC />
      <BottomNavbar />
    </>
  );
};

// 🔹 Login Component with Redirection (Fix for Incorrect Hook Usage)
const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  return <Login />;
};

// 🔹 App Component
const App: React.FC = () => {
  return (
    <AuthState>
      <TxnState>
        <QuickState>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<ProtectedRoutes />} />
            </Routes>
          </Router>
        </QuickState>
      </TxnState>
    </AuthState>
  );
};

export default App;
