import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaWallet, FaMoneyCheckAlt, FaHandHoldingUsd, FaChartLine } from "react-icons/fa";

export default function AllStats() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAmount = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/fetchamount`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        setData(res.data);
      } catch (err) {
        console.error("Error fetching amounts:", err);
      }
    };

    fetchAmount();
  }, []);

  if (!data) {
    return (
      <div
       
      >
        Loading...
      </div>
    );
  }

  const stats = [
    { label: "Today Spend", value: data.todayAmount, icon: <FaWallet />, tint: "rgba(138,43,226,0.2)" },
    { label: "Current Balance", value: data.total_balance, icon: <FaMoneyCheckAlt />, tint: "rgba(105, 90, 205, 0.76)" },
    { label: "Total Loan", value: data.total_loan_amount, icon: <FaChartLine />, tint: "rgba(255, 0, 0, 0.74)" },
    { label: "Total Lending", value: data.total_lending_amount, icon: <FaHandHoldingUsd />, tint: "rgba(30, 143, 255, 0.61)" },
  ];

  return (
    <div
    
    >
 

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "20px",
          width: "100%",
          maxWidth: "1000px",
        }}
      >
        {stats.map((item, idx) => (
          <div
            key={idx}
            style={{
              background: `linear-gradient(135deg, ${item.tint}, rgba(255,255,255,0.05))`,
              borderRadius: "16px",
              padding: "25px",
              color: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
              backdropFilter: "blur(15px)",
              WebkitBackdropFilter: "blur(15px)",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
              e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.4)";
            }}
          >
            {/* Moving glossy overlay */}
            <div
              style={{
                position: "absolute",
                top: "-50%",
                left: "-50%",
                width: "200%",
                height: "200%",
                background:
                  "linear-gradient(120deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)",
                transform: "rotate(25deg)",
                animation: "sweep 4s linear infinite",
                pointerEvents: "none",
              }}
            ></div>

            <div style={{ fontSize: "2rem", marginBottom: "10px", zIndex: 1 }}>
              {item.icon}
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: "bold", zIndex: 1 }}>
              ₹{item.value}
            </div>
            <div style={{ fontSize: "1rem", opacity: 0.85, zIndex: 1 }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Animation Keyframes */}
      <style>
        {`
          @keyframes sweep {
            0% { transform: rotate(25deg) translateX(-150%); }
            100% { transform: rotate(25deg) translateX(150%); }
          }
        `}
      </style>
    </div>
  );
}
