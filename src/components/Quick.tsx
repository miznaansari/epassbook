import { useContext, useEffect, useState } from "react";
import QuickContext from "../context/QuickContext";
import TxnContext from "../context/TxnContext";
import { motion, AnimatePresence } from "framer-motion";

interface QuickProps {
  isOpen: boolean;
  category: string;
  onClose: () => void;
}

interface Quantities {
  [key: string]: number;
}

const Quick: React.FC<QuickProps> = ({ isOpen, onClose, category }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loader, setLoader] = useState(false);
  const [addingLoader, setAddingLoader] = useState<{ [key: string]: boolean }>({});
  const [quantities, setQuantities] = useState<Quantities>({});
  const [quick, setQuick] = useState({ category: "", name: "", cost: "" });

  const context = useContext(QuickContext);
  const txnContext = useContext(TxnContext);

  if (!context || !txnContext) {
    console.error("Context not found");
    return null;
  }

  const { addquickitems, fetchquickitems, quicklist } = context;
  const { addquickitemstxn } = txnContext;

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

  // Fetch quick items when token is available
  useEffect(() => {
    if (token) {
      console.log("Fetching quick items...");
      fetchquickitems();
    }
  }, [token]); // Ensure function is in the dependency array

  // Initialize quantities
  useEffect(() => {
    if (quicklist.length > 0) {
      const initialQuantities = quicklist.reduce((acc, item) => {
        acc[item._id] = 1;
        return acc;
      }, {} as Quantities);
      setQuantities(initialQuantities);
    }
  }, [quicklist]);

  const addTxnQuick = async (id: string, e: React.FormEvent) => {
    e.preventDefault();
    setAddingLoader((prev) => ({ ...prev, [id]: true }));

    try {
      const response = await addquickitemstxn(id, quantities[id]);
      console.log("Transaction response:", response);
    } catch (error) {
      console.error("Error adding transaction:", error);
    }

    setAddingLoader((prev) => ({ ...prev, [id]: false }));
  };

  const incrementQuantity = (id: string) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 1) + 1,
    }));
  };

  const decrementQuantity = (id: string) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) - 1),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoader(true);

    try {
      const data = await addquickitems(quick);
      console.log("Item added:", data);
    } catch (error) {
      console.error("Error adding quick item:", error);
    }

    setLoader(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuick({ ...quick, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setQuick((prev) => ({ ...prev, category }));
  }, [category]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex justify-center items-center bg-[#1e2939ad] bg-opacity-50 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <motion.div
          className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg"
          initial={{ y: 100, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
        >
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h2 className="text-2xl font-bold">Add Quick Access</h2>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
              <i className="fa-solid fa-x text-xl"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex space-x-3">
              <input
                type="text"
                value={quick.name}
                onChange={onChange}
                name="name"
                placeholder="Name"
                className="border w-2/4 rounded-lg px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <input
                type="number"
                value={quick.cost}
                onChange={onChange}
                placeholder="Cost"
                name="cost"
                className="w-1/3 border rounded-lg px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />

              <button
                disabled={loader}
                className="w-1/4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              >
                {loader ? "Saving..." : "Save"}
              </button>
            </div>
          </form>

          <h2 className="text-xl font-semibold mt-6 mb-3">Monthly Expense</h2>
          <div className="max-h-64 overflow-y-auto border rounded-lg">
            <table className="w-full text-sm text-left text-gray-800 border-collapse">
              <thead className="bg-blue-100">
                <tr>
                  <th className="py-2 px-4 border">Expense</th>
                  <th className="py-2 px-4 border">Cost</th>
                  <th className="py-2 px-4 border text-center">Quantity</th>
                  <th className="py-2 px-4 border text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {quicklist
                  .filter((item) => item.category === category)
                  .map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border">{item.name}</td>
                      <td className="py-2 px-4 border">{item.cost}</td>
                      <td className="py-2 px-4 border flex justify-center space-x-2">
                        <button onClick={() => decrementQuantity(item._id)} className="bg-gray-300 px-2 rounded">-</button>
                        <span>{quantities[item._id] || 1}</span>
                        <button onClick={() => incrementQuantity(item._id)} className="bg-gray-300 px-2 rounded">+</button>
                      </td>
                      <td className="py-2 px-4 border text-center">
                        <form onSubmit={(e) => addTxnQuick(item._id, e)}>
                          <button className="bg-blue-500 text-white px-3 py-1 rounded">
                            {addingLoader[item._id] ? "Adding..." : "Add"}
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Quick;
