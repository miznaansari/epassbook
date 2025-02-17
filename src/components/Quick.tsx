import { useEffect, useState } from "react";

interface Expense {
  id: number;
  name: string;
  amount: number; // Fixed: changed from category to amount

}

interface QuickProps {
  isOpen: boolean;
  category:string;
  onClose: () => void; // Added missing prop
  onSubmit: (expense: { name: string; amount: number }) => void;
}

const Quick: React.FC<QuickProps> = ({ onSubmit, isOpen, onClose ,category}) => {
  const [quick, setqucik] = useState({"category":"","name":"","cost":""});
 

  const [expenses ] = useState<Expense[]>([
    { id: 1, name: "Rent", amount: 1000 },
    { id: 2, name: "Groceries", amount: 200 },
    { id: 3, name: "Electricity", amount: 150 },
  ]);

  const onChange =(e: React.ChangeEvent<HTMLInputElement>)=>{
    setqucik({...quick,[e.target.name]:e.target.value});
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
   console.log(quick);
  };
  useEffect(() => {
    setqucik({...quick,category:category});
   
  }, [category])
  

  const quickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(e);

  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Add Quick Access</h2>
        <form onSubmit={handleSubmit} className="flex items-center space-x-4 mb-6">
          <input
            type="text"
            value={quick.name}
            onChange={onChange}
            name="name"
            placeholder="Name"
            className="w-1/4 border rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 flex-1"
            required
          />

          <input
            type="number"
            value={quick.cost}
            onChange={onChange}
            placeholder="Cost"
            name="cost"
            className="w-1/4 border rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 flex-1"
            required
          />
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Submit
          </button>
        </form>

        <h2 className="text-xl font-semibold mb-4">Monthly Expense</h2>
        <div className="max-h-64 overflow-y-auto border">
          <table className="w-full text-sm text-left text-gray-700 border">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border">Expense</th>
                <th className="py-2 px-4 border">Cost</th>
                <th className="py-2 px-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{expense.name}</td>
                  <td className="py-2 px-4 border">
                    <form onSubmit={quickSubmit}>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          className="w-[70%] border rounded px-3 py-2"
                          value={expense.amount}
                          onChange={onChange}
                          required
                        />

                        <button
                          type="submit"
                          className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600"
                        >
                          Add
                        </button>
                      </div>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Quick;