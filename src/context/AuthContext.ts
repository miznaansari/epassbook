import { createContext } from "react";

interface AuthContextType {
  credential: { name: string; email: string; dob: string; password: string; cpassword: string };
  setcredential: React.Dispatch<React.SetStateAction<{ name: string; email: string; dob: string; password: string; cpassword: string }>>;
  loginCredention: { email: string; password: string };
  setloginCredention: React.Dispatch<React.SetStateAction<{ email: string; password: string }>>;
  signup: () => void;
  login: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;
