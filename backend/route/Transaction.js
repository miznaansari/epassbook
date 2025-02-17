const express = require('express');
const router = express.Router();
const UserTransaction = require('../model/UserTransaction');
const authMiddleware = require('../middleware/auth'); // Import JWT middleware

const mongoose = require("mongoose");

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

        res.json({ todayAmount, yesterdayAmount, monthlyAmount, yearlyAmount });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
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
        const { transaction_name, transaction_type, transaction_status, amount, description } = req.body;
        
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
            description
        });

        await newTransaction.save();
        res.status(201).json({ message: "Transaction added successfully", transaction: newTransaction });
    } catch (error) {
        console.error("Error adding transaction:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
