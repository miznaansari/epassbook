import { useState } from "react";
import TxnContext from "./TxnContext";
import axios from "axios";


const TxnState: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    // const [todayamount, settodayamount] = useState<number | null>(null);
//http://localhost:4000
//https://epassbook.onrender.com
    const user = localStorage.getItem("user");
    const userData = user ? JSON.parse(user) : null;
    const id = userData ? userData._id : "";
    const url = "https://epassbook.onrender.com";
    const token = localStorage.getItem('token');

    const [txnDetail, setTxnDetail] = useState({
        user_id: id,
        transaction_name: "",
        transaction_type: "",
        transaction_status: "",
        amount: "",
        description: "",
    });

    const [todayAmount, settodayAmount] = useState<number>(0);
    const [loanAmount, setloanAmount] = useState<number>(0);
    const [lendingAmount, setlendingAmount] = useState<number>(0);


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
            response.data
            // console.log(response.data); // Handle the response
            console.log(txnDetail.amount)
            const a = parseFloat(txnDetail.amount) + todayAmount
            settodayAmount(a);
             // Vibration
             if (navigator.vibrate) {
                navigator.vibrate([200, 100, 200]); // Pattern: Vibrate, Pause, Vibrate
            }

            // Play Success Sound
            const successSound = new Audio('https://dl.prokerala.com/downloads/ringtones/files/mp3/success-level-52186.mp3');
            successSound.play();

        } catch (error) {
            console.error("Error adding transaction:", error);
        }
    };

    const fetchallamount = async () => {
        if (!token) {
            console.error("Token is missing!" + token);
            return;
        }

        try {
            const response = await axios.post(
                `${url}/api/fetchamount`,
                {},
                {
                    headers: {
                        Authorization: token,  // Add 'Bearer ' if required
                        "Content-Type": "application/json",
                    },
                }
            );


            console.log("asdfsd" + token);
            console.log(response.data);
            setloanAmount(response.data.total_loan_amount)
            setlendingAmount(response.data.total_lending_amount)
            settodayAmount(response.data.todayAmount);
            setmonthlyAmount(response.data.monthlyAmount);
        } catch (error) {
            console.error("Error fetching amount:", error);
        }
    };




    const addquickitemstxn = (id: string, quantity: number) => {
        const data = {
            id: id,
            quantity: quantity  // Changed to 'quantity' to match backend
        };

       axios.post(`${url}/api/addquickitems`, data, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response.data.amount);  // Handle success
                const amount = response.data.amount +   todayAmount;
                settodayAmount(amount);
            
            })
            .catch(error => {
                console.error("Error adding quick item:", error);  // Handle error
            });
    }

    return (
        <TxnContext.Provider value={{ txnDetail, setTxnDetail, addtxn, fetchallamount,loanAmount,lendingAmount, todayAmount, monthlyAmount ,addquickitemstxn}}>
            {children}
        </TxnContext.Provider>
    );

};

export default TxnState;
