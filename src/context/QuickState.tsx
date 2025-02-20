// import { useState } from "react";
import axios from "axios";
import QuickContext from "./QuickContext";
import { useEffect, useState } from "react";


const QuickState: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const url = 'https://epassbook.onrender.com';
    const token = localStorage.getItem('token') || '';
    const [quicklist, setquicklist] = useState<{ _id: string; name: string; cost: string; category: string; }[]>([]);

    useEffect(() => {
        console.log(quicklist)

    }, [quicklist])


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
                console.log(response.data.message);  // Handle success
            })
            .catch(error => {
                console.error("Error adding quick item:", error);  // Handle error
            });
    }


    const fetchquickitems = async () => {
        const response = await axios.post(`${url}/api/fetchquickitems`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token

            }
        });
        const a = response.data;
        setquicklist(a);
    }


    const addquickitems = async (quickitems: any) => {
        const response = await axios.post(`${url}/api/addquickitem`, quickitems,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            }
        );
        const newquickitem = response.data.data
        setquicklist(prev => [...prev, newquickitem]);
    }

    return (
        <QuickContext.Provider value={{ addquickitems, fetchquickitems, quicklist, addquickitemstxn }}>
            {children}
        </QuickContext.Provider>
    );

};

export default QuickState;
