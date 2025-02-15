import React, { useState } from "react";

interface Transaction {
  id: number;
  transaction_type: "all" | "loan" | "lending";
  transaction_name: string;
  amount: number;
  transaction_status: string;
  created_at: string;
}

const transactions: Transaction[] = [
  {
    id: 1,
    transaction_type: "loan",
    transaction_name: "John Doe",
    amount: 5000,
    transaction_status: "loan_pending",
    created_at: "2024-02-15T10:00:00Z",
  },
  {
    id: 2,
    transaction_type: "lending",
    transaction_name: "Jane Smith",
    amount: 3000,
    transaction_status: "lending_received",
    created_at: "2024-02-14T08:30:00Z",
  },
  {
    id: 3,
    transaction_type: "all",
    transaction_name: "Mike Johnson",
    amount: 2000,
    transaction_status: "success",
    created_at: "2024-02-13T14:15:00Z",
  },
];

const SectionC: React.FC = () => {
  const [filter, setFilter] = useState<string>("all");

  const filterData = (type: string) => {
    setFilter(type);
  };

  return (
    <div className="p-4">
      <div className="flex gap-2 justify-around mt-4 mx-4 tablefilterbtn">
        <button className="p-2 rounded-lg shadow-md flex-1" onClick={() => filterData("all")}>
          Transaction
        </button>
        <button className="p-2 rounded-lg shadow-md flex-1" onClick={() => filterData("loan")}>
          Loan
        </button>
        <button className="p-2 rounded-lg shadow-md flex-1" onClick={() => filterData("lending")}>
          Lending
        </button>
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
          {transactions
            .filter((transaction) => filter === "all" || transaction.transaction_type === filter)
            .map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50 transaction-row">
                <td className="py-4 px-4 text-[11px]">
                  {transaction.id} / {transaction.transaction_type}
                </td>
                <td className="py-4 px-4">{transaction.transaction_name}</td>
                <td className="py-4 px-4">${transaction.amount}</td>
                <td className="py-4 px-4 text-center">
                  {transaction.transaction_type === "loan" && transaction.transaction_status === "loan_pending" ? (
                    <button className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200">
                      Pay
                    </button>
                  ) : transaction.transaction_type === "loan" && transaction.transaction_status === "loan_paid" ? (
                    <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-md">
                      Paid
                    </span>
                  ) : transaction.transaction_type === "lending" && transaction.transaction_status === "lending_pending" ? (
                    <button className="px-3 py-1 text-xs font-semibold text-orange-700 bg-orange-100 rounded-md hover:bg-orange-200">
                      Borrow
                    </button>
                  ) : transaction.transaction_type === "lending" && transaction.transaction_status === "lending_received" ? (
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
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default SectionC;
