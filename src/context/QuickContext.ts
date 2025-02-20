import { createContext } from "react";

interface QuickContextType {
    quicklist: { _id: string; name: string; cost: string; category: string; }[]; 
    fetchquickitems: () => Promise<void>;
    addquickitemstxn: (id: any,quantity: any) => void;

    addquickitems: (quickitems: any) => Promise<void>;
}

const QuickContext = createContext<QuickContextType | null>(null);


export default QuickContext;
