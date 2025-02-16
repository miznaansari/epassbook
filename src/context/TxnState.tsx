import { useState } from "react";
import TxnContext from "./TxnContext";
import axios from "axios";

const TxnState: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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


    return (
        <TxnContext.Provider value={{ txnDetail, setTxnDetail,addtxn }}>
            {children}
        </TxnContext.Provider>
    );
};

export default TxnState;
