import { useState } from "react";
import AuthContext from "./AuthContext";

const AuthState = ({ children }: any) => {
  const [credential, setcredential] = useState({name:"",email:"",dob:"",password:"",cpassword:""});


  return (
    <AuthContext.Provider value={{credential, setcredential}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;
