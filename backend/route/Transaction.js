const express = require('express');
const router = express.Router();
const UserTransaction = require('../model/UserTransaction');
const authMiddleware = require('../middleware/auth'); // Import JWT middleware

const mongoose = require("mongoose");

router.post('/addprevioustxn', authMiddleware, async (req, res) => {
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

//payLoanBorrowtxn
router.put('/payLoanBorrowtxn', authMiddleware, async (req, res) => {
    try {
        const txnId = req.query.id;
        const userId = req.user.id;
        const { balance, amount, transaction_name, description } = req.body;

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

        // ✅ Validate amount
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({ error: "Invalid amount" });
        }
        if (txn.balance - numericAmount < 0) {
            return res.status(400).json({
                error: `You are trying to pay ₹${numericAmount}, but only ₹${txn.balance} is available.`
            });
        }

        if (amount) txn.balance = txn.balance - numericAmount;

        await txn.save();
        res.status(200).json({ message: "Transaction edited successfully", transaction: txn });
    } catch (error) {
        console.error("Error editing transaction:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//edittxn
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


//deleteAllTxn
router.delete('/deleteAllTxn', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await UserTransaction.deleteMany({ user_id: userId });

        res.status(200).json({
            message: "All transactions deleted successfully",
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error("Error deleting transactions:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/fetchamount", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const now = new Date();

        const toUTC = (date) => new Date(date.getTime() - (5.5 * 60 * 60 * 1000));

        const getUTCDateRange = (startOffset = 0, endOffset = 0) => {
            const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + startOffset, 0, 0, 0);
            const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + endOffset, 23, 59, 59, 999);
            return [toUTC(start), toUTC(end)];
        };

        const [startToday, endToday] = getUTCDateRange(0, 0);
        const [startYesterday, endYesterday] = getUTCDateRange(-1, -1);
        const startOfMonthUTC = toUTC(new Date(now.getFullYear(), now.getMonth(), 1));
        const endOfMonthUTC = toUTC(new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999));
        const startOfYearUTC = toUTC(new Date(now.getFullYear(), 0, 1));
        const endOfYearUTC = toUTC(new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999));

        const getAmount = async (start, end) => {
            const result = await UserTransaction.aggregate([
                {
                    $match: {
                        user_id: userObjectId,
                        createdAt: { $gte: start, $lte: end },
                        transaction_type: { $ne: 'balance' } // Exclude 'balance'
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
            getAmount(startToday, endToday),
            getAmount(startYesterday, endYesterday),
            getAmount(startOfMonthUTC, endOfMonthUTC),
            getAmount(startOfYearUTC, endOfYearUTC),
        ]);

        const result = await UserTransaction.aggregate([
            {
                $match: {
                    user_id: userObjectId,
                    transaction_type: { $in: ['loan', 'lending'] }
                }
            },
            {
                $group: {
                    _id: "$transaction_type",
                    total: { $sum: { $toDecimal: "$amount" } }
                }
            }
        ]);

        let total_loan_amount = "0";
        let total_lending_amount = "0";

        result.forEach(entry => {
            if (entry._id === 'loan') total_loan_amount = entry.total.toString();
            if (entry._id === 'lending') total_lending_amount = entry.total.toString();
        });

        res.json({
            todayAmount,
            yesterdayAmount,
            monthlyAmount,
            yearlyAmount,
            total_loan_amount,
            total_lending_amount
        });

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
        let { transaction_name, transaction_type, transaction_status, amount, description, balance } = req.body;

        // Use `req.user.id` from JWT payload instead of manually passing `user_id`
        const user_id = req.user.id;

        if (!transaction_name || !transaction_type || !transaction_status || !amount) {
            return res.status(400).json({ error: "All required fields must be provided" });
        }

        if (transaction_type === 'spend') {
            balance = 0
        }

        const newTransaction = new UserTransaction({
            user_id,
            transaction_name,
            transaction_type,
            transaction_status,
            amount,
            description, balance
        });

        await newTransaction.save();
        res.status(201).json({ message: "Transaction added successfully", transaction: newTransaction });
    } catch (error) {
        console.error("Error adding transaction:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
