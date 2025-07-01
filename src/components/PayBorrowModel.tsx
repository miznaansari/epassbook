import React, { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TxnContext from "../context/TxnContext";
import TextField from '@mui/material/TextField';
interface Transaction {
  id: string;  // MongoDB _id is a string
  transaction_type: string;  // Allow any value from API
  transaction_name: string;
  amount: number;
  balance: number;
  transaction_status: string;
  created_at: string;
  description?: string;
}
interface TransactionData {
  transaction_name: string;
  amount: number;
  balance: number;

  description: string;
}


interface ModalProps {
  singleTransaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}


const PayBorrowModel: React.FC<ModalProps> = ({ singleTransaction, isOpen, onClose }) => {
  if (!singleTransaction) return null;
  const context = useContext(TxnContext);
  if (!context) {
    throw new Error("TxnContext must be used within a provider");
  }

  const { deletetxn, payLoanBorrowtxn } = context;
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(singleTransaction || {});




  const [errors, setErrors] = useState<{ balance?: string }>({});
  const [loading, setLoading] = useState(false);

  // Sync state when modal opens with the correct transaction
  useEffect(() => {
    setFormData(singleTransaction || null);
  }, [singleTransaction]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (!formData) return;

    if (name === "amount") {
      const numericValue = value === '' ? 0 : parseFloat(value);

      // Check for valid number format
      if (!/^\d*\.?\d*$/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          amount: "Amount must be a valid number",
        }));
        return;
      }

      // Check that amount is not more than balance
      if (numericValue > (formData.balance ?? 0)) {
        setErrors((prev) => ({
          ...prev,
          amount: "Amount cannot be more than balance",
        }));
        return;
      }

      // No errors
      setErrors((prev) => ({ ...prev, amount: undefined }));

      setFormData((prev) => ({
        ...prev!,
        amount: value ==='' ? 0 : numericValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev!,
        [name]: value,
      }));
    }
  };


  const handleSave = async () => {
    if (!formData || !singleTransaction) return;
    setLoading(true);

    // Ensure only the required fields are passed
    const formattedData: TransactionData = {
      transaction_name: formData.transaction_name,
      amount: formData.amount,
      balance: formData.amount,
      description: formData.description || ""  // Ensure non-null value
    };

    await payLoanBorrowtxn(singleTransaction.id.toString(), formattedData);
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
            <h2 className="text-xl font-semibold mb-4">Paying User Loan</h2>

            <div className="space-y-3">

              <TextField
                size="small"
                sx={{ my: 1 }}
                label="Transaction Name"
                variant="outlined"
                name="transaction_name"
                value={formData.transaction_name}
                onChange={handleChange}
                disabled={!isEditing}
                fullWidth
                placeholder="Enter Transaction Name"
              />

              <TextField
                size="small"
                sx={{ my: 1 }}
                label="Amount"
                variant="outlined"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                disabled={!isEditing}
                error={!!errors.balance}
                helperText={errors.balance}
                fullWidth
              />

              {errors.balance && <p className="text-red-500 text-xs mt-1">{errors.balance}</p>}
            </div>

            <div className="flex gap-2 mt-4">
              {isEditing ? (
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-lg flex-1 hover:bg-green-600 disabled:bg-gray-400"
                  onClick={handleSave}
                  disabled={!!errors.balance || loading}
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

export default PayBorrowModel;
