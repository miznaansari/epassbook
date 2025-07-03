import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Quick from "./Quick";
import { FaUtensils, FaPlaneDeparture, FaBox, FaEllipsisH } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import AddPreviousTxn from "./Addprevioustxn";
import TxnContext from "../context/TxnContext";

const BottomNavbar: React.FC = () => {
  const [showLogout, setShowLogout] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<string>("");
  const [isOpenTxn, setIsOpenTxn] = useState(false);
  const navigate = useNavigate();
  const context = useContext(TxnContext);
  if (!context) {
    throw new Error("Login must be used within an AuthProvider");
  }
  const {deleteAccount} = context;

  const handleCategoryClick = (cat: string) => {
    setIsOpen(true);
    setCategory(cat);
  };

  const showTxn = () => {
    setIsOpenTxn(true);
    setShowLogout(false);
  };
const handleDeleteAccount = () =>{
  deleteAccount()
}
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 border-t border-gray-300">
      <div className="flex justify-around py-3">
        {[
          { icon: <FaUtensils />, label: "Food", category: "food" },
          { icon: <FaPlaneDeparture />, label: "Travel", category: "travel" },
          { icon: <FaBox />, label: "Expenses", category: "expenses" },
        ].map(({ icon, label, category }) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className="flex flex-col items-center text-gray-600 hover:text-purple-600 transition-all duration-200"
          >
            <div className="text-xl">{icon}</div>
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}

        {/* More Options Button */}
        <button
          onClick={() => setShowLogout(!showLogout)}
          className="flex flex-col items-center text-gray-600 hover:text-gray-800 transition-all duration-200"
        >
          <FaEllipsisH className="text-xl" />
          <span className="text-xs font-medium">More</span>
        </button>
      </div>

      {/* Logout and Other Options */}
      <AnimatePresence>
        {showLogout && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed flex flex-col w-full gap-4 justify-center items-center bottom-20 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-4 border border-gray-300"
          >
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
                setShowLogout(false);
              }}
              className="bg-red-600 text-white px-5 py-2 rounded shadow-md hover:bg-red-500 w-full"
            >
              Logout
            </button>
            <button
              onClick={() => {
              handleDeleteAccount()  
              }}
              className="bg-red-600 text-white px-5 py-2 rounded shadow-md hover:bg-red-500 w-full"
            >
              Delete Account
            </button>
            <button
              className="bg-gray-800 text-white px-5 py-2 rounded shadow-md hover:bg-gray-700 w-full"
              onClick={showTxn}
            >
              Add Previous Transaction
            </button>
            <button className="bg-gray-800 text-white px-5 py-2 rounded shadow-md hover:bg-gray-700 w-full">
              Update & Delete TXN
            </button>
            <button className="bg-blue-600 text-white px-5 py-2 rounded shadow-md hover:bg-blue-500 w-full">
              Download PDF
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Modal */}
      <Quick isOpen={isOpen} onClose={() => setIsOpen(false)} category={category} />

      {/* Add Previous Transaction Modal */}
      {isOpenTxn && <AddPreviousTxn setisOpenTxn={setIsOpenTxn} />}
    </div>
  );
};

export default BottomNavbar;
