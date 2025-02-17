import axios from "axios";
import React, { useEffect, useState } from "react";

interface Transaction {
  id: number;
  transaction_type: "all" | "loan" | "lending";
  transaction_name: string;
  amount: number;
  transaction_status: string;
  created_at: string;
}

const SectionC: React.FC = () => {
  const [alltxn, setAllTxn] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const token = localStorage.getItem("token");

  const fetchTxn = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/fetchtxn",
        { filter: "monthly" },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      // Transform API data safely
      const formattedData: Transaction[] = response.data.transactions.map(
        (txn: any) => ({
          id: txn._id, // Convert `_id` to `id`
          transaction_type: txn.transaction_type,
          transaction_name: txn.transaction_name,
          amount: txn.amount ? parseFloat(txn.amount.$numberDecimal || txn.amount) : 0, // Safely parse amount
          transaction_status: txn.transaction_status,
          created_at: txn.createdAt, // Rename `createdAt` to `created_at`
        })
      );

      setAllTxn(formattedData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTxn();
  }, []);

  const filteredTransactions = alltxn.filter(
    (transaction) => filter === "all" || transaction.transaction_type === filter
  );

  return (
    <div >
      <div className="flex gap-2 justify-around mt-4 mx-2 tablefilterbtn">
        {["all", "loan", "lending"].map((type) => (
          <button
            key={type}
            className={`p-2 rounded-lg shadow-md flex-1 ${
              filter === type ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <table className="mt-4 w-full text-sm text-left text-gray-700 bg-white rounded-lg shadow-md overflow-hidden">
        <thead className="bg-gray-100 text-gray-900 text-xs font-semibold uppercase tracking-wider">
          <tr>
            <th className="py-4 px-4 text-[10px]">Txn ID / Type</th>
            <th className="py-4 px-4">Name</th>
            <th className="py-4 px-4">Amount</th>
            <th className="py-4 px-4 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="hover:bg-gray-50 transaction-row"
              >
                <td className="py-4 px-4 text-[11px]">
  {`...${transaction.id.toString().slice(-4)}`} / {transaction.transaction_type}
</td>

                <td className="py-4 px-4">{transaction.transaction_name}</td>
                <td className="py-4 px-4">{transaction.amount.toFixed(2)}</td>
                <td className="py-4 px-4 text-center">
                  {transaction.transaction_type === "loan" &&
                  transaction.transaction_status === "loan_pending" ? (
                    <button className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200">
                      Pay
                    </button>
                  ) : transaction.transaction_type === "loan" &&
                    transaction.transaction_status === "loan_paid" ? (
                    <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-md">
                      Paid
                    </span>
                  ) : transaction.transaction_type === "lending" &&
                    transaction.transaction_status === "lending_pending" ? (
                    <button className="px-3 py-1 text-xs font-semibold text-orange-700 bg-orange-100 rounded-md hover:bg-orange-200">
                      Borrow
                    </button>
                  ) : transaction.transaction_type === "lending" &&
                    transaction.transaction_status === "lending_received" ? (
                    <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-md">
                      Received
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-md">
                      Success
                    </span>
                  )}
                  <br />
                  <p className="text-[10px]">
                    {new Date(transaction.created_at).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                      }
                    )}
                  </p>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">
                No transactions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SectionC;
