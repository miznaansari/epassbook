import React, { useState, useContext, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TxnContext from "../context/TxnContext";

interface TransactionData {
  transaction_name: string;
  amount: string;
  description: string;
  date: string;
}

interface AddPreviousTxnProps {
  setisOpenTxn: (value: boolean) => void; // Changed type to function
}

const AddPreviousTxn: React.FC<AddPreviousTxnProps> = ({ setisOpenTxn }) => {
  const context = useContext(TxnContext);
  if (!context) {
    throw new Error("TxnContext is undefined. Make sure it is provided.");
  }

  // const { addtxn } = context;
  const [formData, setFormData] = useState<TransactionData>({
    transaction_name: "",
    amount: "", // Keeping amount as a string since input fields return strings
    description: "",
    date: "",
  });

  const [errors, setErrors] = useState<Partial<TransactionData>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    let newErrors: Partial<TransactionData> = {};
    if (!formData.transaction_name) newErrors.transaction_name = "Name is required";
    if (!formData.amount || isNaN(Number(formData.amount))) newErrors.amount = "Valid amount is required";
    if (!formData.date) newErrors.date = "Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    // await addtxn(formData);
    setFormData({ transaction_name: "", amount: "", description: "", date: "" });
    setisOpenTxn(false); // Close modal after submission
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white p-6 rounded-lg shadow-lg w-96"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
        >
          <h2 className="text-xl font-semibold mb-4">Add Previous Transaction</h2>
          <input
            type="text"
            name="transaction_name"
            placeholder="Transaction Name"
            value={formData.transaction_name}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          {errors.transaction_name && <p className="text-red-500 text-xs">{errors.transaction_name}</p>}

          <input
            type="text"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          {errors.amount && <p className="text-red-500 text-xs">{errors.amount}</p>}

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          {errors.date && <p className="text-red-500 text-xs">{errors.date}</p>}

          <div className="flex gap-2 mt-4">
            <button className="bg-green-500 text-white px-4 py-2 rounded flex-1" onClick={handleSubmit}>
              Save
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded flex-1" onClick={() => setisOpenTxn(false)}>
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddPreviousTxn;
