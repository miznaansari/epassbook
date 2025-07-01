const express = require('express');
const router = express.Router();
const UserTransaction = require('../model/UserTransaction');
const authMiddleware = require('../middleware/auth'); // Import JWT middleware

const mongoose = require("mongoose");

    router.post('/addprevioustxn',authMiddleware , async (req , res)=>{
        const { amount, transaction_name, description, createdAt } = req.body;
        const user_id = req.user.id;
        const newTransaction = new UserTransaction({
            user_id,
            transaction_name,
            transaction_type,
            transaction_status,
            amount, 
            description,
            createdAt
        });

        await newTransaction.save();
        res.status(201).json({ message: "Transaction added successfully", transaction: newTransaction });


    })


    router.put('/edittxn', authMiddleware, async (req, res) => {
    try {
        const txnId = req.query.id;
        const userId = req.user.id;
        const { amount, transaction_name, description } = req.body;

        if (!txnId) {
            return res.status(400).json({ error: "Transaction ID is required" });
        }

        const txn = await UserTransaction.findById(txnId);

        if (!txn) {
            return res.status(404).json({ error: "Transaction not found" });
            }

        if (txn.user_id.toString() !== userId) {
            return res.status(403).json({ error: "Unauthorized to edit this transaction" });
        }

        if (amount) txn.amount = amount;
        if (transaction_name) txn.transaction_name = transaction_name;
        if (description) txn.description = description;

        await txn.save();
        res.status(200).json({ message: "Transaction edited successfully", transaction: txn });
    } catch (error) {
        console.error("Error editing transaction:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.delete('/deletetxn', authMiddleware, async (req, res) => {
    try {
        const txnId = req.query.id;
        const userId = req.user.id;
console.log(txnId);
        const txn = await UserTransaction.findById(txnId);

        if (!txn) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        if (txn.user_id.toString() !== userId) {
            return res.status(403).json({ error: "Unauthorized to delete this transaction" });
        }

        await UserTransaction.findByIdAndDelete(txnId);
        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        console.error("Error deleting transaction:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.post("/fetchamount", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; 
       

        const userObjectId = new mongoose.Types.ObjectId(userId);

        const now = new Date();

        // Convert IST to UTC by subtracting 5 hours 30 minutes
        const toUTC = (date) => new Date(date.getTime() - (5.5 * 60 * 60 * 1000));

        const startOfTodayIST = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const endOfTodayIST = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        const startOfTodayUTC = toUTC(startOfTodayIST);
        const endOfTodayUTC = toUTC(endOfTodayIST);

        const startOfYesterdayUTC = new Date(startOfTodayUTC);
        startOfYesterdayUTC.setUTCDate(startOfYesterdayUTC.getUTCDate() - 1);
        const endOfYesterdayUTC = new Date(endOfTodayUTC);
        endOfYesterdayUTC.setUTCDate(endOfYesterdayUTC.getUTCDate() - 1);

        const startOfMonthUTC = toUTC(new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0));
        const endOfMonthUTC = toUTC(new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999));

        const startOfYearUTC = toUTC(new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0));
        const endOfYearUTC = toUTC(new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999));

        const getAmount = async (start, end) => {
            const result = await UserTransaction.aggregate([
                { 
                    $match: { 
                        user_id: userObjectId,  
                        createdAt: { $gte: start, $lte: end }
                    }
                },
                { 
                    $group: { 
                        _id: null, 
                        total: { $sum: { $toDecimal: "$amount" } }
                    }
                }
            ]);
            return result.length ? parseFloat(result[0].total) : 0;  
        };

        const [todayAmount, yesterdayAmount, monthlyAmount, yearlyAmount] = await Promise.all([
            getAmount(startOfTodayUTC, endOfTodayUTC),
            getAmount(startOfYesterdayUTC, endOfYesterdayUTC),
            getAmount(startOfMonthUTC, endOfMonthUTC),
            getAmount(startOfYearUTC, endOfYearUTC),
        ]);

         // Use $facet to perform both aggregations in one request
         const result = await UserTransaction.aggregate([
            { 
                $match: { 
                    user_id: userObjectId, 
                    transaction_type: { $in: ['loan', 'lending'] }
                } 
            },
            {
                $facet: {
                    loanSum: [
                        { $match: { transaction_type: 'loan' } },
                        { 
                            $group: { 
                                _id: null, 
                                totalAmount: { $sum: { $toDecimal: "$amount" } } 
                            } 
                        }
                    ],
                    lendingSum: [
                        { $match: { transaction_type: 'lending' } },
                        { 
                            $group: { 
                                _id: null, 
                                totalAmount: { $sum: { $toDecimal: "$amount" } } 
                            } 
                        }
                    ]
                }
            }
        ]);

        // Extract the totals or default to "0"
        const total_loan_amount = result[0]?.loanSum[0]?.totalAmount?.toString() || "0";
        const total_lending_amount = result[0]?.lendingSum[0]?.totalAmount?.toString() || "0";


        res.json({ todayAmount, yesterdayAmount, monthlyAmount, yearlyAmount ,total_loan_amount,total_lending_amount });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/fetchtxnLL', authMiddleware, async (req, res) => {
    try {
        // Convert user_id to ObjectId
        const userObjectId = new mongoose.Types.ObjectId(req.user.id);

        // Use $facet to perform both aggregations in one request
        const result = await UserTransaction.aggregate([
            { 
                $match: { 
                    user_id: userObjectId, 
                    transaction_type: { $in: ['loan', 'lending'] }
                } 
            },
            {
                $facet: {
                    loanSum: [
                        { $match: { transaction_type: 'loan' } },
                        { 
                            $group: { 
                                _id: null, 
                                totalAmount: { $sum: { $toDecimal: "$amount" } } 
                            } 
                        }
                    ],
                    lendingSum: [
                        { $match: { transaction_type: 'lending' } },
                        { 
                            $group: { 
                                _id: null, 
                                totalAmount: { $sum: { $toDecimal: "$amount" } } 
                            } 
                        }
                    ]
                }
            }
        ]);

        // Extract the totals or default to "0"
        const total_loan_amount = result[0]?.loanSum[0]?.totalAmount?.toString() || "0";
        const total_lending_amount = result[0]?.lendingSum[0]?.totalAmount?.toString() || "0";

        res.status(200).json({
            total_loan_amount,
            total_lending_amount
        });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ error: "Server error while fetching transactions" });
    }
});






router.post('/fetchtxn', authMiddleware, async (req, res) => {
    try {
        const user_id = req.user.id;
        const { filter } = req.body; // Accept filter type from request

        let startDate, endDate;

        // Get current date
        const now = new Date();

        switch (filter) {
            case "today":  // Fetch today's transactions
                startDate = new Date(now.setHours(0, 0, 0, 0));
                endDate = new Date(now.setHours(23, 59, 59, 999));
                break;

            case "yesterday":  // Fetch yesterday's transactions
                startDate = new Date();
                startDate.setDate(now.getDate() - 1);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date();
                endDate.setDate(now.getDate() - 1);
                endDate.setHours(23, 59, 59, 999);
                break;

            case "monthly":  // Fetch transactions for the current month
                startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
                break;

            case "yearly":  // Fetch transactions for the current year
                startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
                endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
                break;

            case "all": // Fetch all transactions
                startDate = null;
                endDate = null;
                break;

            default:
                return res.status(400).json({ success: false, message: "Invalid filter type" });
        }

        let query = { user_id: user_id };
        
        // Apply date filter only if not fetching "all" transactions
        if (startDate && endDate) {
            query.createdAt = { $gte: startDate, $lt: endDate };
        }

        // Fetch transactions
        const txn = await UserTransaction.find(query);

        res.status(200).json({ success: true, transactions: txn });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});



// Add transaction (Protected Route)
router.post('/addtxn', authMiddleware, async (req, res) => {
    try {
        const { transaction_name, transaction_type, transaction_status, amount, description,balance } = req.body;
        
        // Use `req.user.id` from JWT payload instead of manually passing `user_id`
        const user_id = req.user.id;

        if (!transaction_name || !transaction_type || !transaction_status || !amount) {
            return res.status(400).json({ error: "All required fields must be provided" });
        }

        const newTransaction = new UserTransaction({
            user_id,
            transaction_name,
            transaction_type,
            transaction_status,
            amount, 
            description,balance
        });

        await newTransaction.save();
        res.status(201).json({ message: "Transaction added successfully", transaction: newTransaction });
    } catch (error) {
        console.error("Error adding transaction:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
