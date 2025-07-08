import React, { useEffect, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TxnContext from "../context/TxnContext";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  txnType: string;
  txnStatus: string;
}

const UpdateAndDeleteModal: React.FC<ModalProps> = ({ isOpen, onClose, txnType, txnStatus }) => {
  const context = useContext(TxnContext);
  if (!context) return null;

  const { txnDetail, setTxnDetail, addtxn } = context;
  const [errors, setErrors] = useState<{ amount?: string }>({});
  const [loader, setLoader] = useState(false);

  const [currentBalance, setCurrentBalance] = useState(0);
  const [previousBalance, setPreviousBalance] = useState(0);
  const [useBalance, setUseBalance] = useState(false); // checkbox for spending balance

  const txnTypeMap: Record<string, string> = {
    lending: "Lending Txn",
    loan: "Loan Txn",
    spend: "Spend Txn",
    balance: "Balance Txn",
  };

  useEffect(() => {
    setTxnDetail(prev => ({
      ...prev,
      transaction_type: txnType,
      transaction_status: txnStatus,
    }));
  }, [txnType, txnStatus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTxnDetail(prev => ({
      ...prev,
      [name]: value,
      ...(name === "amount" && { balance: value }),
    }));

    if (name === "amount") {
      setErrors(prev => ({
        ...prev,
        amount: /^\d*\.?\d*$/.test(value) ? undefined : "Amount must be a valid number",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (errors.amount) return;

    const amount = parseFloat(txnDetail.amount) || 0;
    setPreviousBalance(currentBalance);

    if (txnType === "balance") {
      setCurrentBalance(prev => prev + amount);
    } else if (txnType === "spend" && useBalance) {
      setCurrentBalance(prev => prev - amount);
    }

    setLoader(true);
    await addtxn();
    setLoader(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex justify-center items-center bg-[#1e2939ad] z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg w-96"
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
          >
            {/* BALANCE BOXES */}
            <div className="flex gap-2 justify-around mb-4 w-full">
              <div className="bg-purple-500 text-white p-4 rounded-lg shadow-md flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <i className="fas fa-wallet text-2xl"></i>
                    <div className="ml-3">
                      <h2 className="text-sm font-semibold">Current Balance</h2>
                      <motion.p
                        className="text-lg font-bold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                      >
                        ₹{currentBalance.toFixed(2)}
                      </motion.p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-500 text-white p-4 rounded-lg shadow-md flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <i className="fas fa-clock-rotate-left text-2xl"></i>
                    <div className="ml-3">
                      <h2 className="text-sm font-semibold">Previous Balance</h2>
                      <motion.p
                        className="text-lg font-bold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                      >
                        ₹{previousBalance.toFixed(2)}
                      </motion.p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">{txnTypeMap[txnType]}</h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {[{ label: "Transaction Spend", name: "transaction_name", placeholder: "Enter Transaction Name" },
              { label: "Transaction Price", name: "amount", placeholder: "Enter Transaction Price" },
              { label: "Description", name: "description", placeholder: "Enter Description" }]
                .map(({ label, name, placeholder }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-gray-700">{label}</label>
                    <input
                      type="text"
                      name={name}
                      value={(txnDetail as any)[name] || ""}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className={`w-full border ${errors[name as keyof typeof errors] ? "border-red-500" : "border-gray-300"
                        } rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500`}
                      required
                    />
                    {errors[name as keyof typeof errors] && (
                      <p className="text-red-500 text-xs mt-1">{errors[name as keyof typeof errors]}</p>
                    )}
                  </div>
                ))}

              {/* Use Balance Checkbox (only for spend) */}
              {txnType === "spend" && (
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={useBalance}
                    onChange={() => setUseBalance(!useBalance)}
                  />
                  Use Balance
                </label>
              )}

              {loader && (
                <div className="flex justify-center items-center">
                  <div className="w-5 h-5 border-4 border-t-transparent border-blue-500 rounded-full animate-spin mr-2"></div>
                  <span>Processing...</span>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex-1 disabled:bg-gray-400"
                  disabled={!!errors.amount}
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 flex-1"
                >
                  Close
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdateAndDeleteModal;
