import { useState } from "react";
import { auth, googleProvider, signInWithPopup } from "../firebase";
import { useNavigate } from "react-router-dom";

const Google = () => {

  const [loader, setloader] = useState(false);
  const navigate = useNavigate();
  const handleGoogleLogin = async () => {
    try {
      setloader(true);
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result)
      const idToken = await result.user.getIdToken(); // 🔥 Get Firebase ID Token
      const photoUrl =  result.user.photoURL; // 🔥 Get Firebase ID Token

      // Send the ID token to the backend for verification
      const response = await fetch("http://localhost:4000/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken ,photoUrl }),
      });

      const data = await response.json();
      setloader(false);
      console.log("Login Response:", data.token);
      localStorage.setItem('token',data.token);
      navigate('/');
      
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center mt-3">
      
      <button
        onClick={handleGoogleLogin}
        className="flex items-center bg-white dark:bg-gray-900 border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 dark:text-white hover:text-black hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        {loader && (
    <div className="w-5 h-5 border-4 mr-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
  )}
        
        <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 0 48 48">
          <g fill="none" fillRule="evenodd">
            <path fill="#FBBC05" d="M9.827 24c0-1.524.253-2.986.705-4.356l-7.909-6.04C1.082 16.734.214 20.26.214 24c0 3.737.868 7.261 2.407 10.388l7.904-6.051C10.077 26.973 9.827 25.517 9.827 24z" />
            <path fill="#EB4335" d="M23.714 10.133c3.311 0 6.302 1.173 8.652 3.093l6.836-6.827c-4.166-3.627-9.507-5.867-15.489-5.867C14.427.533 6.445 5.844 2.623 13.604l7.909 6.04c1.822-5.532 7.017-9.511 13.182-9.511z" />
            <path fill="#34A853" d="M23.714 37.867c-6.165 0-11.36-3.978-13.182-9.51l-7.909 6.038c3.822 7.762 11.804 13.073 21.091 13.073 5.732 0 11.204-2.035 15.311-5.848l-7.507-5.804c-2.118 1.334-4.785 2.052-7.803 2.052z" />
            <path fill="#4285F4" d="M46.145 24c0-1.387-.214-2.88-.535-4.267H23.714v9.067h12.604c-.63 3.091-2.345 5.468-4.8 7.015l7.507 5.805c4.314-4.004 7.12-9.969 7.12-16.62z" />
          </g>
        </svg>
        <span className="flex items-center space-x-2">
  
  <span>Continue with Google</span>
</span>

      </button>
    </div>
  );
};

export default Google;
