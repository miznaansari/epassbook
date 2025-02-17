import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import AuthContext from "../context/AuthContext";
import Google from "./Google";

const Login = () => {

  const [Loader, setLoader] = useState(false);
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Login must be used within an AuthProvider");
  }

  const { loginCredention, setloginCredention, login } = context;
  const navigate = useNavigate(); // ✅ Initialize useNavigate

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setloginCredention({ ...loginCredention, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoader(true);
    const success: boolean = await login(); // ✅ TypeScript now recognizes this as boolean
    setLoader(false);
    console.log(success);
  
    if (success) {
      navigate("/"); // ✅ Redirect only on success
    } else {
      alert("Invalid credentials. Try again!"); // ❌ Show error message
    }
  };


  
  

  return (
    <div className="mt-18 flex flex-col justify-center items-center px-6 max-w-md m-auto">
      <h2 className="text-xl font-bold text-purple-800 text-center">
        Welcome to E-Passbook
      </h2>
      <p className="text-purple-600 mt-2 text-center">
        Manage your financial expenses with ease
      </p>
      <Google />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-lg shadow-md mt-4 p-6"
      >
        {/* Email Field */}
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-purple-800">
            Email Address
          </label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={loginCredention.email}
            onChange={handleChange}
            className="mt-2 w-full px-4 py-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-purple-800">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={loginCredention.password}
            onChange={handleChange}
            className="mt-2 w-full px-4 py-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>

        {/* Login Button */}
        <div>
          <button
            type="submit"
            className="w-full flex justify-center items-center py-2 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <span className={`px-2 ${Loader ? 'motion-safe:animate-spin' : 'hidden'}`}>.</span>

            Login
          </button>
          
        </div>
      </form>
    </div>
  );
};

export default Login;


