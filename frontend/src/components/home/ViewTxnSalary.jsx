import React, { useEffect, useRef, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

const ViewTxn = () => {
  const chartRef = useRef(null);
  const containerRef = useRef(null);

  const [filter, setFilter] = useState(localStorage.getItem("txnFilter") || "all");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post(
          "https://epassbook.onrender.com/api/fetchtxn",
          { filter },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        setTransactions(res.data.transactions || []);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };

    fetchData();
  }, [filter]);

  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    setFilter(newFilter);
    localStorage.setItem("txnFilter", newFilter);
  };

  // Filter transactions to only include those with transaction_type === "balance"
  const filteredTxns = transactions.filter((txn) => txn.transaction_type === "balance");

  // Calculate totals per transaction_name category
  const categoryTotals = {};
  filteredTxns.forEach((txn) => {
    const category = txn.transaction_name || "Other";
    const amount = parseFloat(txn.amount?.$numberDecimal || txn.amount) || 0;
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
          "#ff6b6b", "#feca57", "#1dd1a1", "#54a0ff", "#5f27cd", "#10ac84", "#222f3e"
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
    <div ref={containerRef} style={{ textAlign: "center", color: "#fff" }}>
      <h2 style={{ marginBottom: "20px" }}>Expense Breakdown</h2>

      {/* Filter Dropdown */}
      <select
        value={filter}
        onChange={handleFilterChange}
        style={{
          backgroundColor: "#1e1e2f",
          color: "#fff",
          padding: "8px 12px",
          borderRadius: "6px",
          border: "1px solid #444",
          marginBottom: "20px",
          outline: "none",
          fontSize: "14px",
        }}
      >
        <option value="today">Today</option>
        <option value="yesterday">Yesterday</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
        <option value="all">All</option>
      </select>

      {/* Doughnut Chart */}
      {labels.length > 0 ? (
        <div style={{ width: "350px", height: "350px", margin: "auto" }}>
          <Doughnut ref={chartRef} data={data} options={options} />
        </div>
      ) : (
        <p style={{ color: "#aaa", marginTop: "40px" }}>No balance-type transactions to display.</p>
      )}
    </div>
  );
};

export default ViewTxn;
