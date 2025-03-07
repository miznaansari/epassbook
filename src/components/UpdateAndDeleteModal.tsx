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
  if (!context) {
    console.error("TxnContext is null! Ensure TxnState is wrapping this component.");
    return null;
  }
  const { txnDetail, setTxnDetail, addtxn } = context;

  // Error state
  const [errors, setErrors] = useState<{ amount?: string }>({});

  // Update txnType and txnStatus
  useEffect(() => {
    setTxnDetail((prev) => ({
      ...prev,
      transaction_type: txnType,
      transaction_status: txnStatus,
    }));
  }, [txnType, txnStatus]);

  // Input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTxnDetail({ ...txnDetail, [name]: value });

    // Validate amount input
    if (name === "amount") {
      if (!/^\d*\.?\d*$/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          amount: "Amount must be a valid number",
        }));
      } else {
        setErrors((prev) => ({ ...prev, amount: undefined }));
      }
    }
  };

  // Submit handler
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!errors.amount) {
      console.log("Form submitted", txnDetail);
      addtxn();
    }
  };

  return (
    <AnimatePresence>
    {isOpen && (
      <motion.div
        className="fixed inset-0 flex justify-center items-center bg-[#1e2939ad] bg-opacity-50 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <motion.div
          className="bg-white p-6 rounded-lg shadow-lg w-96"
          initial={{ y: 100, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 15,
          }}
        >
          <h2 className="text-xl font-semibold mb-4">Update & Delete TXN</h2>
  
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Transaction Spend
              </label>
              <input
                type="text"
                name="transaction_name"
                value={txnDetail.transaction_name}
                onChange={handleChange}
                placeholder="Enter Transaction Name"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Transaction Price
              </label>
              <input
                type="text"
                name="amount"
                value={txnDetail.amount}
                onChange={handleChange}
                placeholder="Enter Transaction Price"
                className={`w-full border ${
                  errors.amount ? "border-red-500" : "border-gray-300"
                } rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500`}
                required
              />
              {errors.amount && (
                <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
              )}
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={txnDetail.description}
                onChange={handleChange}
                placeholder="Enter Transaction ID"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
  
            {/* Buttons */}
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex-1 disabled:bg-gray-400"
                disabled={!!errors.amount} // Disable if there's an error
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
