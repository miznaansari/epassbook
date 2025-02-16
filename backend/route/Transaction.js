const express = require('express');
const router = express.Router();
const UserTransaction = require('../model/UserTransaction');
const authMiddleware = require('../middleware/auth'); // Import JWT middleware

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
