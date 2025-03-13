import axios from "axios";
import React, { useEffect, useState } from "react";
import EditableModal from "./EditableModal"; // Import the modal component

interface Transaction {
  id: string;
  transaction_type: string;
  transaction_name: string;
  amount: number;
  transaction_status: string;
  created_at: string;
  description?: string;
}

const SectionC: React.FC = () => {
  const [alltxn, setAllTxn] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction>({
    id: "",
    transaction_type: "",
    transaction_name: "",
    amount: 0,
    transaction_status: "",
    created_at: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;
  const token = localStorage.getItem("token");

  const fetchTxn = async () => {
    try {
      const response = await axios.post(
        "https://epassbook.onrender.com/api/fetchtxn",
        { filter: "monthly" },
        {
          headers: {
            Authorization: token || "",
            "Content-Type": "application/json",
          },
        }
      );

      const formattedData: Transaction[] = response.data.transactions.map((txn: any) => ({
        id: String(txn._id),
        transaction_type: txn.transaction_type || "unknown",
        transaction_name: txn.transaction_name || "Unnamed",
        amount: typeof txn.amount === "object"
          ? parseFloat(txn.amount.$numberDecimal || "0")
          : parseFloat(txn.amount || "0"),
        transaction_status: txn.transaction_status || "unknown",
        created_at: txn.createdAt || new Date().toISOString(),
        description: txn.description || "",
      }));

      // Sort transactions by created_at (latest first)
      const sortedData = formattedData.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setAllTxn(sortedData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTxn();
  }, []);

  // Filter transactions based on selected type
  const filteredTransactions = alltxn.filter(
    (transaction) => filter === "all" || transaction.transaction_type === filter
  );

  // Pagination logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const viewAllDetail = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex gap-2 justify-around mt-4 mx-2">
        {["all", "loan", "lending"].map((type) => (
          <button
            key={type}
            className={`p-2 rounded-lg shadow-md flex-1 ${
              filter === type ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => { setFilter(type); setCurrentPage(1); }} // Reset to first page when filter changes
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <table className="mt-4 w-full text-sm text-left text-gray-700 bg-white rounded-lg shadow-md">
        <thead className="bg-gray-100 text-gray-900 text-xs font-semibold uppercase tracking-wider">
          <tr>
            <th className="py-4 px-4 text-[10px]">Txn ID / Type</th>
            <th className="py-4 px-4">Name</th>
            <th className="py-4 px-4">Amount</th>
            <th className="py-4 px-4 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {currentTransactions.length > 0 ? (
            currentTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => viewAllDetail(transaction)}
              >
                <td className="py-4 px-4 text-[11px]">
                  {`...${transaction.id.slice(-4)}`} / {transaction.transaction_type}
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
                    {new Date(transaction.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "2-digit",
                    })}
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

      {/* Pagination Controls */}
      {filteredTransactions.length > transactionsPerPage && (
        <div className="flex justify-between mt-4">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 mx-2 rounded-lg ${
              currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"
            }`}
          >
            Back
          </button>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 mx-2 rounded-lg ${
              currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Editable Modal */}
      {isModalOpen && selectedTransaction && (
        <EditableModal
          singleTransaction={selectedTransaction}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default SectionC;
