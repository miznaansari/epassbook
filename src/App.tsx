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
import TxnView from "./components/TxnView/TxnView";

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

// 🔹 Login Component with Redirection
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

// 🔹 SendSummary Component (TextField + Button)
const SendSummary: React.FC = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("No token found, please login again.");
      return;
    }

    if (!text.trim()) {
      setMessage("Please enter something before sending.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://epassbook.onrender.com/sendSummary",
        { summary: text }, // payload
        { headers: { Authorization: token } }
      );

      setMessage(response.data.message || "Summary sent successfully!");
      setText("");
    } catch (error: any) {
      console.error(error);
      setMessage("Failed to send summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Send Summary</h2>
      <textarea
        style={{
          width: "100%",
          minHeight: "100px",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your summary..."
      />
      <button
        onClick={handleSend}
        disabled={loading}
        style={{
          marginTop: "10px",
          width: "100%",
          padding: "10px",
          background: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        {loading ? "Sending..." : "Send"}
      </button>

      {message && <p style={{ marginTop: "10px" }}>{message}</p>}
    </div>
  );
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
              <Route path="/txnview" element={<TxnView />} />
              <Route path="/signup" element={<LoginPage />} />
              <Route path="/send-summary" element={<SendSummary />} /> {/* ✅ New Page */}
              <Route path="/" element={<ProtectedRoutes />} />
            </Routes>
          </Router>
        </QuickState>
      </TxnState>
    </AuthState>
  );
};

export default App;
