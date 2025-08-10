import React, { useState } from "react";

const overlayStyle = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.65)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
  backdropFilter: "blur(8px)",
  animation: "overlayFadeIn 0.4s ease forwards",
};

const dialogStyle = {
  background: "rgba(255, 255, 255, 0.08)",
  borderRadius: "20px",
  padding: "30px 35px",
  width: "90%",
  maxWidth: "420px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  color: "#e0e0e0",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  animation: "dialogPopIn 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards",
};

const buttons = [
  { 
    name: "Add Balance", 
    icon: (
      <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    gradient: "linear-gradient(90deg, #00c6ff, #0072ff)"
  },
  { 
    name: "Add Spend", 
    icon: (
      <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <line x1="12" y1="2" x2="12" y2="22"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
      </svg>
    ),
    gradient: "linear-gradient(90deg, #ff416c, #ff4b2b)"
  },
  { 
    name: "Add Loan", 
    icon: (
      <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M9 21H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
    ),
    gradient: "linear-gradient(90deg, #ff6a00, #ee0979)"
  },
  { 
    name: "Add Lending", 
    icon: (
      <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 3v4M8 3v4M3 11h18"/>
      </svg>
    ),
    gradient: "linear-gradient(90deg, #f7971e, #ffd200)"
  },
];

export default function Allbutton() {
  const [openDialog, setOpenDialog] = useState(null);
  const [formData, setFormData] = useState({ field1: "", field2: "", field3: "" });

  const open = (name) => {
    setOpenDialog(name);
    setFormData({ field1: "", field2: "", field3: "" });
  };

  const close = () => setOpenDialog(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(openDialog, formData);
    close();
  };

  return (
    <>
      <style>{`
        @keyframes overlayFadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes dialogPopIn {
          0% { transform: scale(0.8) translateY(30px); opacity: 0; filter: blur(6px); }
          60% { transform: scale(1.02) translateY(-4px); opacity: 1; filter: blur(0); }
          100% { transform: scale(1) translateY(0); }
        }
        button {
          border: none;
          outline: none;
          font-weight: 600;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 30px;
          border-radius: 40px;
          color: white;
          font-size: 1rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
          user-select: none;
        }
        button:hover {
          filter: brightness(1.1);
          box-shadow: 0 6px 25px rgba(0,0,0,0.35);
        }
      `}</style>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
          padding: "30px 20px",
          borderRadius: "20px",
          width: "100%",
          margin: "auto",
        }}
      >
        {buttons.map(({ name, icon, gradient }) => (
          <button
            key={name}
            onClick={() => open(name)}
            style={{ background: gradient }}
            aria-label={name}
          >
            {icon}
            <span>{name.toUpperCase()}</span>
          </button>
        ))}
      </div>

      {openDialog && (
        <div style={overlayStyle} onClick={close}>
          <form
            style={dialogStyle}
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
          >
            <h2 style={{ marginBottom: "25px", fontWeight: "700", fontSize: "1.8rem", textAlign: "center", color: "#f0f0f0", textShadow: "0 2px 6px #000" }}>
              {openDialog}
            </h2>

            {["Transaction Name", "Transaction Amount", "Transaction Description"].map((field, i) => (
              <label
                key={field}
                style={{
                  display: "block",
                  marginBottom: i === 2 ? "30px" : "18px",
                  fontSize: "0.95rem",
                  color: "#ccc",
                  fontWeight: "600",
                }}
              >
                {field}
                <input
                  name={field}
                  type="text"
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    marginTop: "8px",
                    padding: "10px 14px",
                    borderRadius: "12px",
                    border: "none",
                    background: "rgba(255,255,255,0.12)",
                    color: "#eee",
                    fontSize: "1rem",
                    boxShadow: "inset 0 0 8px rgba(0,0,0,0.3)",
                    outline: "none",
                    transition: "background-color 0.3s ease",
                  }}
                  onFocus={(e) => (e.target.style.background = "rgba(255,255,255,0.3)")}
                  onBlur={(e) => (e.target.style.background = "rgba(255,255,255,0.12)")}
                />
              </label>
            ))}

            <div style={{ display: "flex", justifyContent: "space-between", gap: "15px" }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  background: "linear-gradient(145deg, #27ae60bb, #218c4dbb)",
                  boxShadow: "0 8px 20px #27ae60cc",
                  borderRadius: "14px",
                  color: "#fff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "linear-gradient(45deg, #2ecc71dd, #2ecc7177)";
                  e.currentTarget.style.boxShadow = "0 12px 32px #2ecc71ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "linear-gradient(145deg, #27ae60bb, #218c4dbb)";
                  e.currentTarget.style.boxShadow = "0 8px 20px #27ae60cc";
                }}
              >
                Submit
              </button>
              <button
                type="button"
                onClick={close}
                style={{
                  flex: 1,
                  background: "linear-gradient(145deg, #c0392bbb, #992d2788)",
                  boxShadow: "0 8px 20px #c0392bcc",
                  borderRadius: "14px",
                  color: "#fff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "linear-gradient(45deg, #e74c3cdd, #e74c3c77)";
                  e.currentTarget.style.boxShadow = "0 12px 32px #e74c3cff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "linear-gradient(145deg, #c0392bbb, #992d2788)";
                  e.currentTarget.style.boxShadow = "0 8px 20px #c0392bcc";
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
