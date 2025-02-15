import { useState } from "react";
import AuthContext from "./AuthContext";
import axios from "axios";


const AuthState = ({ children }: any) => {
  const [credential, setcredential] = useState({ name: "", email: "", dob: "", password: "", cpassword: "" });
  const [loginCredention, setloginCredention] = useState({ email: "", password: "" });  

  const url = "http://localhost:4000";
  const login = async (): Promise<boolean> => {
    try {
      const response = await axios.post(`${url}/api/login`, loginCredention);
      console.log(response.data);
      alert("Login successful!");
      localStorage.setItem("token", response.data.token);
      return true; // ✅ Return true on success
    } catch (error) {
      console.error("Login error:", error);
      return false; // ❌ Return false on failure
    }
  };
  
  const signup = async () => {
    try {
      const response = await axios.post(`${url}/api/create`, credential);
      console.log(response.status);
      if (response.status === 200) {
        setcredential({ name: "", dob: "", password: "", cpassword: "", email: "" });
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ credential, setcredential, setloginCredention, signup, loginCredention, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;
