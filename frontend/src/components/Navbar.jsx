import React, { useState, useEffect } from "react";
import { Link } from "react-router";

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    window.location.reload();
  };

  return (
    <>
      {/* Navbar */}
      <nav style={styles.navbar}>
        {/* Website Name */}
        <div style={styles.logo}>
          <span style={styles.logoText}>E-PassBook</span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/transactions" style={styles.link}>View all txn</Link>
          {isAuthenticated ? (
            <>
              <span style={styles.link} onClick={handleLogout}>Logout</span>
              <img
                src="https://i.pravatar.cc/40"
                alt="User Avatar"
                style={styles.avatar}
              />
            </>
          ) : (
            <>
              <Link to="/auth" style={styles.link}>Login</Link>
              <Link to="/auth" style={styles.link}>Signup</Link>
            </>
          )}
        </div>

        {/* Mobile Right Section */}
        <div className="flex md:hidden items-center gap-3">
          {isAuthenticated && (
            <img
              src="https://i.pravatar.cc/40"
              alt="User Avatar"
              style={styles.avatar}
            />
          )}
          <div style={styles.hamburger} onClick={() => setIsDrawerOpen(true)}>
            <div style={styles.bar}></div>
            <div style={styles.bar}></div>
            <div style={styles.bar}></div>
          </div>
        </div>
      </nav>

      {/* Drawer */}
      <div
        style={{
          ...styles.drawer,
          transform: isDrawerOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <button style={styles.closeBtn} onClick={() => setIsDrawerOpen(false)}>
          ✕
        </button>
        <Link to="/" style={styles.drawerLink} onClick={() => setIsDrawerOpen(false)}>Home</Link>
        <Link to="/transactions" style={styles.drawerLink} onClick={() => setIsDrawerOpen(false)}>View all txn</Link>
        {isAuthenticated ? (
          <span
            style={styles.drawerLink}
            onClick={() => {
              handleLogout();
              setIsDrawerOpen(false);
            }}
          >
            Logout
          </span>
        ) : (
          <>
            <Link to="/login" style={styles.drawerLink} onClick={() => setIsDrawerOpen(false)}>Login</Link>
            <Link to="/signup" style={styles.drawerLink} onClick={() => setIsDrawerOpen(false)}>Signup</Link>
          </>
        )}
      </div>
    </>
  );
};

const styles = {
  navbar: {
    width: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 100,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 1.5rem",
    background: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(15px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
    fontFamily: "Poppins, sans-serif",
    color: "#fff",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  logoText: {
    background: "linear-gradient(45deg, #ff00ff, #00ffff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "500",
    cursor: "pointer",
    transition: "color 0.3s",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "2px solid #fff",
    objectFit: "cover",
  },
  hamburger: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    cursor: "pointer",
  },
  bar: {
    width: "25px",
    height: "3px",
    backgroundColor: "#fff",
    borderRadius: "3px",
  },
  drawer: {
    position: "fixed",
    top: 0,
    right: 0,
    height: "100%",
    width: "250px",
    background: "rgba(20, 20, 35, 0.95)",
    backdropFilter: "blur(15px)",
    boxShadow: "-4px 0 20px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
    padding: "1.5rem",
    gap: "1rem",
    transition: "transform 0.3s ease-in-out",
    zIndex: 200,
  },
  closeBtn: {
    alignSelf: "flex-end",
    fontSize: "1.5rem",
    background: "none",
    border: "none",
    color: "#fff",
    cursor: "pointer",
  },
  drawerLink: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "1.1rem",
    fontWeight: "500",
    cursor: "pointer",
    padding: "0.5rem 0",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
};

export default Navbar;
