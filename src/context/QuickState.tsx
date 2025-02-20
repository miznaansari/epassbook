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
        <QuickContext.Provider value={{ addquickitems, fetchquickitems, quicklist }}>
            {children}
        </QuickContext.Provider>
    );

};

export default QuickState;
