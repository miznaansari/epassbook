import { useState } from "react";
import TxnContext from "./TxnContext";
import axios from "axios";
interface Transaction {
    amount: { $numberDecimal: string }; // Ensure amount is properly typed
  }
  
const TxnState: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    // const [todayamount, settodayamount] = useState<number | null>(null);

    const user = localStorage.getItem("user");
    const userData = user ? JSON.parse(user) : null;
    const id = userData ? userData._id : "";
    const url = "http://localhost:4000";
    const token = localStorage.getItem('token');

    const [txnDetail, setTxnDetail] = useState({
        user_id: id,
        transaction_name: "",
        transaction_type: "",
        transaction_status: "",
        amount: "",
        description: "",
    });

    const [todayAmount, settodayAmount] = useState<number | null>(null);
    const [monthlyAmount, setmonthlyAmount] = useState<number | null>(null);

    const addtxn = async () => {
        try {
            const response = await axios.post(
                `${url}/api/addtxn`,
                txnDetail,
                {
                    headers: {
                        Authorization: token,  // Pass token in Authorization header
                        "Content-Type": "application/json" // Ensure JSON data format
                    }
                }
            );
            console.log(response.data); // Handle the response
        } catch (error) {
            console.error("Error adding transaction:", error);
        }
    };

    const fetchallamount = async ()=>{
        const a ={};
        const response = await axios.post(`${url}/api/fetchamount`,a,{
            headers: {
                Authorization: token,  // Pass token in Authorization header
                "Content-Type": "application/json" // Ensure JSON data format
            }
        })
        console.log(response.data);
        settodayAmount(response.data.todayAmount);
        setmonthlyAmount(response.data.monthlyAmount);
    }

    return (
        <TxnContext.Provider value={{ txnDetail, setTxnDetail, addtxn ,fetchallamount,todayAmount,monthlyAmount }}>
          {children}
        </TxnContext.Provider>
      );
      
};

export default TxnState;
