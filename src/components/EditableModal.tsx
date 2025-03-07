import React, { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TxnContext from "../context/TxnContext";

interface Transaction {
  id: string;  // MongoDB _id is a string
  transaction_type: string;  // Allow any value from API
  transaction_name: string;
  amount: number;
  transaction_status: string;
  created_at: string;
  description?: string;
}
interface TransactionData {
  transaction_name: string;
  amount: number;

  description: string;
}


interface ModalProps {
  singleTransaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}


const EditableModal: React.FC<ModalProps> = ({ singleTransaction, isOpen, onClose }) => {
   if (!singleTransaction) return null; 
  const context = useContext(TxnContext);
  if (!context) {
    throw new Error("TxnContext must be used within a provider");
  }

  const { deletetxn, edittxn } = context;
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(singleTransaction || {});

  


  const [errors, setErrors] = useState<{ amount?: string }>({});
  const [loading, setLoading] = useState(false);

  // Sync state when modal opens with the correct transaction
  useEffect(() => {
    setFormData(singleTransaction || null);
  }, [singleTransaction]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (!formData) return; // Prevent errors when `formData` is null

    setFormData((prev) => ({
      ...prev!,
      [name]: name === "amount" ? parseFloat(value) || "" : value,
    }));

    if (name === "amount" && !/^\d*\.?\d*$/.test(value)) {
      setErrors((prev) => ({ ...prev, amount: "Amount must be a valid number" }));
    } else {
      setErrors((prev) => ({ ...prev, amount: undefined }));
    }
  };
  

  const handleSave = async () => {
    if (!formData || !singleTransaction) return;
    setLoading(true);
  
    // Ensure only the required fields are passed
    const formattedData: TransactionData = {
      transaction_name: formData.transaction_name,
      amount: formData.amount,
      description: formData.description || ""  // Ensure non-null value
    };
  
    await edittxn(singleTransaction.id.toString(), formattedData);
    setIsEditing(false);
    setLoading(false);
  };
  

  const handleDelete = async () => {
    if (!singleTransaction) return;
    setLoading(true);
    await deletetxn(singleTransaction.id.toString());
    setLoading(false);
    onClose(); // Close modal after deletion
  };

  return (
    <AnimatePresence>
      {isOpen && formData && (
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
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
          >
            <h2 className="text-xl font-semibold mb-4">Transaction Details</h2>

            <div className="space-y-3">
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter Description"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="transaction_name"
                value={formData.transaction_name}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter Transaction Name"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter Amount"
                className={`w-full p-2 border ${
                  errors.amount ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500`}
              />
              {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
            </div>

            <div className="flex gap-2 mt-4">
              {isEditing ? (
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-lg flex-1 hover:bg-green-600 disabled:bg-gray-400"
                  onClick={handleSave}
                  disabled={!!errors.amount || loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              ) : (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg flex-1 hover:bg-blue-600"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              )}
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg flex-1 hover:bg-red-600 disabled:bg-gray-400"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>

            <button
              className="mt-4 w-full text-gray-700 border p-2 rounded-lg hover:bg-gray-100"
              onClick={onClose}
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditableModal;
