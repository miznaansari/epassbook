import { useContext, useEffect } from "react";
import TxnContext from "../context/TxnContext";

const SectionA = () => {

  const context = useContext(TxnContext)
  if (!context) {
    console.error("TxnContext is null! Ensure TxnState is wrapping this component.");
    return null;
  }
  const {fetchallamount ,todayAmount,monthlyAmount}=context; 

useEffect(() => {
  fetchallamount()
}, []);

  return (
    <>
     <div className="flex gap-2 justify-around m-2">
      <div className="bg-purple-500 text-white p-4 rounded-lg shadow-md flex-1" id="chart">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <i className="fas fa-wallet text-3xl"></i>
            <div className="ml-4">
              <h2 className="text-sm font-semibold">Today Spend</h2>
              <p className="text-xl font-bold" id="spend">₹{todayAmount}</p>
              <h6 className="text-[12px]">₹{monthlyAmount} This Month</h6>
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
      {/* Total Loan Card with Hover Effect */}
      <div className="bg-red-500 text-white p-4 rounded-lg shadow-md flex-1 hover:bg-red-400 transition-all">
        <div className="flex items-center">
          <i className="fas fa-file-invoice text-3xl"></i>
          <div className="ml-4">
            <h2 className="text-sm font-semibold">Total Loan</h2>
            <p className="text-xl font-bold" id="total_loan">₹5000</p>
          </div>
        </div>
      </div>

      {/* Total Lending Card with Animated Flip */}
      <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md flex-1 transform transition duration-300  ">
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
  )
}

export default SectionA
