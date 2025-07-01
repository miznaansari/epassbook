import { useState } from "react";
import UpdateAndDeleteModal from "./UpdateAndDeleteModal";

const SectionB = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [txnType, setTxnType] = useState<string>("");
  const [txnStatus, settxnStatus] = useState<string>("");

  const openModal = (type: string,status:string) => {
    setTxnType(type);
    settxnStatus(status)
    setIsModalOpen(true);
  };

  return (
    <div className="flex gap-2 justify-around mt-4">
      {/* Add Spend Button */}
      <button
        onClick={() => openModal("spend","success")}
        className="bg-purple-500 text-white p-3 rounded-lg shadow-md hover:bg-purple-600 flex items-center text-xs space-x-2"
      >
        <i className="fas fa-wallet text-sm"></i>
        <span>Add Spend</span>
      </button>

      {/* Add Loan Button */}
      <button
        onClick={() => openModal("loan","loan_pending")}
        className="bg-red-500 text-white p-3 rounded-lg shadow-md hover:bg-red-600 flex items-center text-xs space-x-2"
      >
        <i className="fas fa-file-invoice text-sm"></i>
        <span>Add Loan</span>
      </button>

      {/* Add Lending Button */}
      <button
        onClick={() => openModal("lending","lending_pending")}
        className="bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600 flex items-center text-xs space-x-2"
      >
        <i className="fas fa-hand-holding-usd text-sm"></i>
        <span>Add Lending</span>
      </button>

      {/* Modal */}
      <UpdateAndDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        txnType={txnType}
        txnStatus={txnStatus}
      />
    </div>
  );
};

export default SectionB;
