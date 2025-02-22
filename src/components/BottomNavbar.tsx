import { useState } from "react";
import { Link } from "react-router-dom";
import Quick from "./Quick";

const BottomNavbar: React.FC = () => {
  const [showLogout, setShowLogout] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [category, setcategory] = useState("")

  

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50"
      style={{ boxShadow: "2px 1px 5px black" }}
    >
      <div className="flex justify-around py-3">
        {/* Food Button */}
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setcategory("food");
          }}
          className="flex flex-col items-center text-gray-600 hover:text-purple-500"
          
        >
          <i className="fas fa-utensils text-xl"></i>
          <span className="text-xs">Food</span>
        </button>

        {/* Travel Button */}
        <button className="flex flex-col items-center text-gray-600 hover:text-teal-500"
        onClick={() => {
          setIsOpen(!isOpen);
          setcategory("travel");
        }}
        >
          <i className="fas fa-plane-departure text-xl"></i>
          <span className="text-xs">Travel</span>
        </button>

        {/* Expenses Button */}
        <button className="flex flex-col items-center text-gray-600 hover:text-teal-500"
         onClick={() => {
          setIsOpen(!isOpen);
          setcategory("expenses");
        }}>
          <i className="fa-solid fa-box text-xl"></i>
          <span className="text-xs">Expenses</span>
        </button>

        {/* More Button */}
        <button
          onClick={() => setShowLogout(!showLogout)}
          className="flex flex-col items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          <i className="fas fa-ellipsis-h text-xl"></i>
          <span className="text-xs">More</span>
        </button>
      </div>

      {/* Logout Container */}
      <div
        className={`fixed flex flex-col gap-4 justify-center items-center bottom-20 left-1/2 transform -translate-x-1/2 transition-all ${
          showLogout ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <Link to="/logout">
          <button className="bg-gray-800 text-white px-5 py-3 rounded shadow-md hover:bg-gray-700">
            Logout
          </button>
        </Link>
        <Link to="#">
          <button className="bg-gray-800 text-white px-5 py-3 rounded shadow-md hover:bg-gray-700">
            Forget Transaction
          </button>
        </Link>
        <Link to="#">
          <button className="bg-gray-800 text-white px-5 py-3 rounded shadow-md hover:bg-gray-700">
            Update And Delete TXN
          </button>
        </Link>
        <Link to="/download.pdf">
          <button className="bg-gray-800 text-white px-5 py-3 rounded shadow-md hover:bg-gray-700">
            Download PDF
          </button>
        </Link>
      </div>

      <Quick isOpen={isOpen} onClose={() => setIsOpen(false)} category={category} />
    </div>
  );
};

export default BottomNavbar;
