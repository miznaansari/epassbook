import { createContext } from "react";

// Define the type for transactions
interface TransactionData {
  transaction_name: string;
  amount: number;

  description: string;
}

interface TxnContextType {
  txnDetail: TxnDetailType;
  setTxnDetail: React.Dispatch<React.SetStateAction<TxnDetailType>>;
  addtxn: () => void;
  deleteAccount: () => void;
  edittxn: (id: string, formdata: TransactionData) => void;
  payLoanBorrowtxn: (id: string, formdata: TransactionData) => void;
  deletetxn: (id: string) => void;
  addquickitemstxn: (id: any,quantity: any) => void;

  fetchallamount: () => void;
  // todaytxn: () => void;
  todayAmount: number | null; // Ensure it matches useState type
  monthlyAmount: number | null; // Ensure it matches useState type
  loanAmount: number | null; // Ensure it matches useState type
  lendingAmount: number | null; // Ensure it matches useState type
  // settodayamount: React.Dispatch<React.SetStateAction<number | null>>;
}



// Define the initial transaction structure
interface TxnDetailType {
  user_id: string;
  transaction_name: string;
  transaction_type: string;
  transaction_status: string;
  amount: string;
  description: string;
}

// Create Context with default null
const TxnContext = createContext<TxnContextType | null>(null);

export default TxnContext;
