import React, { useState, useEffect, useContext } from "react";
import TxnContext from "../context/TxnContext";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  txnType: string;
  txnStatus: string
}

const UpdateAndDeleteModal: React.FC<ModalProps> = ({ isOpen, onClose, txnType,txnStatus }) => {

  
  const context = useContext(TxnContext)
  if (!context) {
    console.error("TxnContext is null! Ensure TxnState is wrapping this component.");
    return null;
  }
  const {txnDetail, setTxnDetail,addtxn} = context;
  

  // Update transaction_type when txnType prop changes
  useEffect(() => {
    setTxnDetail((prev) => ({ ...prev, transaction_type: txnType }));
    setTxnDetail((prev) => ({ ...prev, transaction_status: txnStatus, }));
  }, [txnType,txnStatus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTxnDetail({ ...txnDetail, [e.target.name]: e.target.value });
   
  };


  

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted", txnDetail);
    addtxn()

  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[#1e2939ad] bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {/* Modal Header */}
        <h2 className="text-xl font-semibold mb-4">Update & Delete TXN</h2>

        {/* Modal Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Transaction Spend</label>
            <input
              type="text"
              name="transaction_name"
              value={txnDetail.transaction_name}
              onChange={handleChange}
              placeholder="Enter Transaction Name"
              className="w-full border rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Transaction Price</label>
            <input
              type="text"
              name="amount"
              value={txnDetail.amount}
              onChange={handleChange}
              placeholder="Enter Transaction Price"
              className="w-full border rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              name="description"
              value={txnDetail.description}
              onChange={handleChange}
              placeholder="Enter Transaction ID"
              className="w-full border rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex-1">
              Submit
            </button>
            <button type="button" onClick={onClose} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 flex-1">
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateAndDeleteModal;
