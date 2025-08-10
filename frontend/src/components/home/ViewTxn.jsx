import React, { useEffect, useRef, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

const ViewTxn = () => {
  const chartRef = useRef(null);

  const [filter, setFilter] = useState(localStorage.getItem("txnFilter") || "all");
  const [fromDate, setFromDate] = useState(localStorage.getItem("txnFromDate") || "");
  const [toDate, setToDate] = useState(localStorage.getItem("txnToDate") || "");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = { filter };

        if (filter === "manual") {
          if (!fromDate || !toDate) return;
          payload.fromDate = fromDate;
          payload.toDate = toDate;
        }

        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/fetchtxn`,
          payload,
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
  }, [filter, fromDate, toDate]);

  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    setFilter(newFilter);
    localStorage.setItem("txnFilter", newFilter);
  };

  const handleFromDateChange = (e) => {
    const value = e.target.value;
    setFromDate(value);
    localStorage.setItem("txnFromDate", value);
  };

  const handleToDateChange = (e) => {
    const value = e.target.value;
    setToDate(value);
    localStorage.setItem("txnToDate", value);
  };

  const totalBalance = transactions
    .filter((txn) => txn.transaction_type === "balance")
    .reduce((acc, txn) => acc + parseFloat(txn.amount?.$numberDecimal || txn.amount || 0), 0);

  const expenses = transactions.filter((txn) =>
    ["spend", "loan", "lending"].includes(txn.transaction_type)
  );

  const expenseMap = {};
  let totalExpenses = 0;

  expenses.forEach((txn) => {
    const name = txn.transaction_name || txn.transaction_type || "Other";
    const amt = parseFloat(txn.amount?.$numberDecimal || txn.amount || 0);
    expenseMap[name] = (expenseMap[name] || 0) + amt;
    totalExpenses += amt;
  });

  const remaining = totalBalance - totalExpenses;

  const labels = ["Remaining", ...Object.keys(expenseMap)];
  const values = [remaining > 0 ? remaining : 0, ...Object.values(expenseMap)];

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#1dd1a1",
          "#ff6b6b", "#feca57", "#54a0ff", "#5f27cd", "#10ac84", "#ff9ff3",
        ],
        borderWidth: 2,
        borderColor: "#1e1e2f",
        hoverBorderColor: "#fff",
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: "70%",
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
    <div style={{ textAlign: "center", color: "#fff" }}>
      <h2 style={{ marginBottom: "20px" }}>Balance vs Expenses</h2>

      <div style={{ marginBottom: "20px" }}>
        <select
          value={filter}
          onChange={handleFilterChange}
          style={{
            backgroundColor: "#1e1e2f",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #444",
            outline: "none",
            fontSize: "14px",
            marginRight: "10px",
          }}
        >
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <option value="all">All</option>
          <option value="manual">Manual (Date Range)</option>
        </select>

        {filter === "manual" && (
          <>
            <input
              type="date"
              value={fromDate}
              onChange={handleFromDateChange}
              style={{
                backgroundColor: "#1e1e2f",
                color: "#fff",
                padding: "6px",
                borderRadius: "6px",
                border: "1px solid #444",
                marginRight: "5px",
              }}
            />
            <input
              type="date"
              value={toDate}
              onChange={handleToDateChange}
              style={{
                backgroundColor: "#1e1e2f",
                color: "#fff",
                padding: "6px",
                borderRadius: "6px",
                border: "1px solid #444",
              }}
            />
          </>
        )}
      </div>

      <div style={{ width: "350px", height: "350px", margin: "auto" }}>
        <Doughnut ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
};

export default ViewTxn;
