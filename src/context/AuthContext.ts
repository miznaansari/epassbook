import { createContext } from "react";

interface CredentialType {
  name: string;
  email: string;
  dob: string;
  password: string;
  cpassword: string;
}

interface AuthContextType {
  credential: CredentialType;
  setcredential: React.Dispatch<React.SetStateAction<CredentialType>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
