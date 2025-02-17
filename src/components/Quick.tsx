import { useEffect, useState } from "react";

interface Expense {
  id: number;
  name: string;
  amount: number;
}

interface QuickProps {
  isOpen: boolean;
  category: string;
  onClose: () => void;
}

const Quick: React.FC<QuickProps> = ({ isOpen, onClose, category }) => {
  const [quick, setQuick] = useState({ category: "", name: "", cost: "" });

  const [expenses] = useState<Expense[]>([
    { id: 1, name: "Rent", amount: 1000 },
    { id: 2, name: "Groceries", amount: 200 },
    { id: 3, name: "Electricity", amount: 150 },
  ]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuick({ ...quick, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setQuick({ ...quick, category });
  }, [category]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-60 z-50">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold">Add Quick Access</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            <i className="fa-solid fa-x text-xl"></i>
          </button>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div className="flex space-x-3">
            <input
              type="text"
              value={quick.name}
              onChange={onChange}
              name="name"
              placeholder="Name"
              className="flex-1 border rounded-lg px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
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
          </div>
          <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
            Submit
          </button>
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
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{expense.name}</td>
                  <td className="py-2 px-4 border">${expense.amount}</td>
                  <td className="py-2 px-4 border text-center text-green-500 text-lg">✔</td>
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