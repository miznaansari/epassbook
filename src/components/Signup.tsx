import { useContext } from "react"
import AuthContext from "../context/AuthContext";
import Google from "./Google";


const Signup = () => {




  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Signup must be used within an AuthProvider");
  }
  const {credential,setcredential,signup}  = context;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setcredential({ ...credential, [e.target.name]: e.target.value });
  };


const handlesubmit = (e: React.FormEvent) => {
  e.preventDefault();
  console.log(credential);
  signup();
 
};


  return (
   <>
    <div
      id="content"
      className=" mt-18 flex flex-col justify-center items-center px-6  max-w-md m-auto"
    >
      {/* Title */}
      <h2 className="text-xl font-bold text-purple-800 text-center">
        Welcome to E-Passbook
      </h2>
      <p className="text-purple-600 mt-2 text-center">
        Manage your financial expenses with ease
      </p>

      <Google />

      {/* Login Form */}
      <form onSubmit={handlesubmit}  className="w-full max-w-md bg-white rounded-lg shadow-md mt-4 p-6">
      <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-purple-800">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            onChange={onChange}
            value={credential.name}
            placeholder="Enter your Name"
            className="mt-2 w-full px-4 py-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

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
            onChange={onChange}
            value={credential.email}
            className="mt-2 w-full px-4 py-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-purple-800">
            DOB
          </label>
          <input
            type="date"
            id="dob"

            name="dob"
            onChange={onChange}
            value={credential.dob}
            placeholder="Enter your email"
            className="mt-2  w-full px-4 py-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
            onChange={onChange}
            value={credential.password}
            placeholder="Enter your password"
            className="mt-2 w-full px-4 py-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-purple-800">
            Confirm Password
          </label>
          <input
            type="password"
            id="cpassword"
            name="cpassword"
            onChange={onChange}
            value={credential.cpassword}
            placeholder="Enter your Confirm password"
            className="mt-2 w-full px-4 py-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

      

        {/* Login Button */}
        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Signup
          </button>
        </div>

        {/* Signup Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/signup" className="text-purple-600 font-medium hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
   </>
  )
}

export default Signup
