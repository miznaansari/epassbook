import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import TxnContext from "../context/TxnContext";

const SectionA = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const context = useContext(TxnContext);

  if (!context) {
    console.error("TxnContext is null! Ensure TxnState is wrapping this component.");
    return null;
  }

  const { fetchallamount, todayAmount, monthlyAmount } = context;

  const [animatedToday, setAnimatedToday] = useState(0);
  const [animatedMonth, setAnimatedMonth] = useState(0);
  const [loading, setLoading] = useState(true);

  // Listen for localStorage token changes
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (token) {
      fetchallamount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // Removed fetchallamount from dependencies
  

  useEffect(() => {
    if (todayAmount !== null && monthlyAmount !== null) {
      setLoading(false);

      let start = 0;
      const duration = 1000;
      const step = (todayAmount / duration) * 10;

      const interval = setInterval(() => {
        start += step;
        setAnimatedToday(Math.min(Math.floor(start), todayAmount));
        if (start >= todayAmount) clearInterval(interval);
      }, 10);

      let startMonth = 0;
      const stepMonth = (monthlyAmount / duration) * 10;
      const intervalMonth = setInterval(() => {
        startMonth += stepMonth;
        setAnimatedMonth(Math.min(Math.floor(startMonth), monthlyAmount));
        if (startMonth >= monthlyAmount) clearInterval(intervalMonth);
      }, 10);
    }
  }, [todayAmount, monthlyAmount]);

  return (
    <>
      <div className="flex gap-2 justify-around m-2">
        <div className="bg-purple-500 text-white p-4 rounded-lg shadow-md flex-1" id="chart">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <i className="fas fa-wallet text-3xl"></i>
              <div className="ml-4">
                <h2 className="text-sm font-semibold">Today Spend</h2>

                {loading ? (
                  <div className="mx-auto w-full max-w-sm rounded-md">
                    <div className="flex space-x">
                      <div className="flex-1 space-y-3">
                        <div className="h-5 rounded bg-gray-300 animate-pulse w-full"></div>
                        <div className="h-3 rounded bg-gray-300 animate-pulse w-full"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <motion.p
                      className="text-xl font-bold"
                      id="spend"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1 }}
                    >
                      ₹{animatedToday}
                    </motion.p>
                    <motion.h6
                      className="text-[12px]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1 }}
                    >
                      ₹{animatedMonth} This Month
                    </motion.h6>
                  </>
                )}
              </div>
            </div>
            <div className="text-center cursor-pointer" id="chartView">
              <i className="fas fa-chart-simple text-xl"></i>
              <p className="text-[12px]">Chart view</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-around mt-4 m-2">
        <div className="bg-red-500 text-white p-4 rounded-lg shadow-md flex-1 hover:bg-red-400 transition-all">
          <div className="flex items-center">
            <i className="fas fa-file-invoice text-3xl"></i>
            <div className="ml-4">
              <h2 className="text-sm font-semibold">Total Loan</h2>
              <p className="text-xl font-bold" id="total_loan">₹5000</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md flex-1 transform transition duration-300">
          <div className="flex items-center">
            <i className="fas fa-hand-holding-usd text-3xl"></i>
            <div className="ml-4">
              <h2 className="text-sm font-semibold">Total Lending</h2>
              <p className="text-xl font-bold" id="total_lending_amount">₹3000</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionA;
