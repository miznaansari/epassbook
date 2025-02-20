const express = require("express");
const router = express.Router();
const QuickAccess = require("../model/QuickAccess");
const authMiddleware = require("../middleware/auth");
const { createLogger } = require("vite");
const UserTransaction = require("../model/UserTransaction");


router.post('/addquickitems', authMiddleware, async (req, res) => {
    try {
        const user_id = req.user.id;
        const { id, quantity } = req.body;

        // Find the item by its ID
        const response = await QuickAccess.findOne({ _id: id });
        if (!response) {
            return res.status(404).json({ message: "Item not found" });
        }
        console.log(response)

        // // Calculate total cost
        const totalcost = response.cost * quantity;
        console.log(totalcost)

        // // Create new QuickAccess item
        const userTXN = new UserTransaction({
            user_id: user_id,

            transaction_type: "spend",
            transaction_name: response.name,
            amount: totalcost,
            transaction_status:"success",
            description: "safd"
        });

        await userTXN.save();
        res.json({ 
            messages: "Quick item added successfully", 
            amount: totalcost 
          });
          
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});



router.post("/fetchquickitems", authMiddleware, async (req, res) => {
    const user_id = req.user.id; // Assuming `authMiddleware` attaches `req.user`
    const quickAccess = await QuickAccess.find(
        { user_id },
        { category: 1, name: 1, cost: 1, _id: 1 } // Projection to include only these fields
    );

    res.json(quickAccess);
});


router.post("/addquickitem", authMiddleware, async (req, res) => {
    try {
        const { category, name, cost } = req.body;
        const user_id = req.user.id; // Assuming `authMiddleware` attaches `req.user`

        // Validate required fields
        if (!category || !name || cost === undefined) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Validate cost
        if (cost < 0) {
            return res.status(400).json({ error: "Cost cannot be negative." });
        }

        // Create a new QuickAccess item
        const newQuickItem = new QuickAccess({ user_id, category, name, cost });

        // Save to database
        await newQuickItem.save();

        res.status(201).json({ message: "Quick access item added successfully!", data: newQuickItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error." });
    }
});

module.exports = router;
