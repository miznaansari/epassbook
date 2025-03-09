import { motion } from "framer-motion";

const UserDashboard = () => {

    

  
  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* User Profile Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 flex items-center gap-4">
        <img
          src={"https://via.placeholder.com/100"}
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-blue-500"
        />
        <div>
          <h2 className="text-2xl font-bold">mohdmizna</h2>
          <p className="text-gray-600">miznaansari@gmail.com</p>
          <p className="text-gray-600">7565887525</p>
        </div>
      </div>

      {/* Today Spend Section */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-purple-500 text-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">Today Spend</h2>
              <motion.p
                className="text-2xl font-bold mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                ₹{  0}
              </motion.p>
              <motion.h6
                className="text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                ₹{ 0} This Month
              </motion.h6>
            </div>
            <i className="fas fa-wallet text-3xl"></i>
          </div>
        </div>

        {/* Loan and Lending Amount Section */}
        <div className="grid grid-rows-2 gap-4">
          <div className="bg-red-500 text-white p-4 rounded-lg shadow-md flex items-center">
            <i className="fas fa-file-invoice text-3xl"></i>
            <div className="ml-4">
              <h2 className="text-sm font-semibold">Total Loan</h2>
              <p className="text-xl font-bold">₹{ 0}</p>
            </div>
          </div>
          <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md flex items-center">
            <i className="fas fa-hand-holding-usd text-3xl"></i>
            <div className="ml-4">
              <h2 className="text-sm font-semibold">Total Lending</h2>
              <p className="text-xl font-bold">₹{ 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
