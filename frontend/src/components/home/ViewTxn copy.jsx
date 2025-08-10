import React, { useRef } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ViewTxn = ({ transactions }) => {
  const chartRef = useRef(null);
  const containerRef = useRef(null);

  // Calculate spend per category
  const categoryTotals = {};
  transactions.forEach((txn) => {
    const category = txn.transaction_name || "Other";
    const amount = parseFloat(txn.amount.$numberDecimal || txn.amount) || 0;
    categoryTotals[category] = (categoryTotals[category] || 0) + amount;
  });

  const labels = Object.keys(categoryTotals);
  const dataValues = Object.values(categoryTotals);

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: [
          "#ff6b6b", // red
          "#feca57", // yellow
          "#1dd1a1", // green
          "#54a0ff", // blue
          "#5f27cd", // purple
        ],
        borderWidth: 2,
        borderColor: "#1e1e2f",
        hoverBorderColor: "#fff",
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: "75%",
    plugins: {
      legend: {
        labels: { color: "#fff", font: { size: 14 } },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ₹${context.raw}`,
        },
      },
    },
  };

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at center, #2d1e48, #0f0f1a)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Expense Breakdown</h2>
      <div style={{ width: "350px", height: "350px" }}>
        <Doughnut ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
};

export default ViewTxn;
