import React, { useState } from "react";
import axios from "axios";
import { FaGoogle } from "react-icons/fa";
import { auth, googleProvider, signInWithPopup } from "../../firebase";
import { useNavigate } from "react-router";

export default function AuthPage({ isLogin = true }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const url = isLogin
        ? "https://epassbook.onrender.com/api/login"
        : "https://epassbook.onrender.com/api/signup";

      const payload = isLogin
        ? { email, password }
        : { name, email, password };

      const res = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        // alert("Authentication successful!");
        console.log("Login successful:", res.data);
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };
  const [loader, setloader] = useState(false);

const handleGoogleSignIn = async () => {
  setError("");
  setLoading(true);
   try {
      setloader(true);
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result)
      const idToken = await result.user.getIdToken(); // 🔥 Get Firebase ID Token
      const photoUrl =  result.user.photoURL; // 🔥 Get Firebase ID Token

      // Send the ID token to the backend for verification
      const response = await fetch("https://epassbook.onrender.com/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken ,photoUrl }),
      });

      const data = await response.json();
      setloader(false);
      console.log("Login Response:", data.token);
      localStorage.setItem('token',data.token);
      navigate('/');
      
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  setLoading(false);
};


  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "radial-gradient(circle at center, #2d1e48, #0f0f1a)",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          padding: "2rem",
          borderRadius: "20px",
          backdropFilter: "blur(10px)",
          boxShadow: "0 0 40px rgba(0,0,0,0.4)",
          width: "450px",
          color: "#fff",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "1rem",
            background: "linear-gradient(45deg, #ff00ff, #00ffff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />
          {error && (
            <div style={{ color: "#ff6666", marginBottom: "0.5rem" }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            style={buttonStyle}
            disabled={loading}
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <button
          onClick={handleGoogleSignIn}
          style={{
            ...buttonStyle,
            background: "transparent",
            border: "1px solid #fff",
            marginTop: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          <FaGoogle /> Sign in with Google
        </button>
        <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem" }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            style={{ color: "#00ffff", cursor: "pointer" }}
            onClick={() => window.location.reload()}
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.8rem",
  marginBottom: "0.8rem",
  border: "none",
  borderRadius: "10px",
  outline: "none",
  background: "rgba(255,255,255,0.1)",
  color: "#fff",
};

const buttonStyle = {
  width: "100%",
  padding: "0.8rem",
  border: "none",
  borderRadius: "10px",
  background: "linear-gradient(45deg, #ff00ff, #00ffff)",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "0.3s",
};
