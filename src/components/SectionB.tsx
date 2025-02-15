const SectionB = () => {
    return (
      <div className="flex gap-2 justify-around mt-4">
        {/* Add Spend Button */}
        <button
          onClick={() => console.log("Add Spend clicked")}
          className="bg-purple-500 text-white p-3 rounded-lg shadow-md hover:bg-purple-600 flex items-center text-xs space-x-2"
        >
          <i className="fas fa-wallet text-sm"></i>
          <span>Add Spend</span>
        </button>
  
        {/* Add Loan Button */}
        <button
          onClick={() => console.log("Add Loan clicked")}
          className="bg-red-500 text-white p-3 rounded-lg shadow-md hover:bg-red-600 flex items-center text-xs space-x-2"
        >
          <i className="fas fa-file-invoice text-sm"></i>
          <span>Add Loan</span>
        </button>
  
        {/* Add Lending Button */}
        <button
          onClick={() => console.log("Add Lending clicked")}
          className="bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600 flex items-center text-xs space-x-2"
        >
          <i className="fas fa-hand-holding-usd text-sm"></i>
          <span>Add Lending</span>
        </button>
      </div>
    );
  };
  
  export default SectionB;
  