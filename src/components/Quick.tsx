import { useContext, useEffect, useState } from "react";
import QuickContext from "../context/QuickContext";

interface QuickProps {
  isOpen: boolean;
  category: string;
  onClose: () => void;
}

// Define the type for quantities
interface Quantities {
  [key: string]: number;
}

const Quick: React.FC<QuickProps> = ({ isOpen, onClose, category }) => {
  const [Loader, setLoader] = useState(false);

  const context = useContext(QuickContext);
  if (!context) {
    console.log("Context not found");
    return null;
  }

  const { addquickitems, fetchquickitems, quicklist ,addquickitemstxn} = context;

  useEffect(() => {
    fetchquickitems();
  }, []);

  const addtxnquick = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Adding ${quantities[id]} units of item with ID: ${id}`);
    addquickitemstxn(id,quantities[id])
  };

  const [quantities, setQuantities] = useState<Quantities>({});

  const handleQuantityChange = (id: string, value: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + value), // Ensures quantity is at least 1
    }));
  };

  // Handle Increment
  useEffect(() => {
    const initialQuantities = quicklist.reduce((acc, item) => {
      acc[item._id] = 1;
      return acc;
    }, {} as Quantities);
    setQuantities(initialQuantities);
  }, [quicklist]);

  const incrementQuantity = (id: string) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: (prevQuantities[id] || 1) + 1,
    }));
  };

  const decrementQuantity = (id: string) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: Math.max(1, (prevQuantities[id] || 1) - 1), // Ensure quantity doesn't go below 1
    }));
  };

  const [quick, setQuick] = useState({ category: "", name: "", cost: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoader(true);
    const data = await addquickitems(quick);
    setLoader(false);

    console.log(data);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuick({ ...quick, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setQuick({ ...quick, category });
  }, [category]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900/50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold">Add Quick Access</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            <i className="fa-solid fa-x text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 ">
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
              disabled={Loader}
              className="w-1/4 relative bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center"
            >
              {Loader ? "Saving..." : "Save"}
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
                <th className="py-2 px-4 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {quicklist
                .filter((quicklistitem) => quicklistitem.category === category)
                .map((quicklistitem) => (
                  <tr key={quicklistitem._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border">{quicklistitem.name}</td>
                    <td className="py-2 px-4 border">{quicklistitem.cost}</td>
                    <td className="py-2 px-4 border text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          type="button"
                          onClick={() => decrementQuantity(quicklistitem._id)}
                          className="bg-gray-300 hover:bg-gray-400 px-2 rounded"
                        >
                          -
                        </button>
                        <span>{quantities[quicklistitem._id] || 1}</span>
                        <button
                          type="button"
                          onClick={() => incrementQuantity(quicklistitem._id)}
                          className="bg-gray-300 hover:bg-gray-400 px-2 rounded"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-2 px-4 border text-center text-green-500 text-lg">
                      <form onSubmit={(e) => addtxnquick(quicklistitem._id, e)}>
                        <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
                          Add
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Quick;
