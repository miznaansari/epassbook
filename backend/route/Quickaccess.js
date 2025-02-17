const express = require("express");
const router = express.Router();
const QuickAccess = require("../model/QuickAccess");
const authMiddleware = require("../middleware/auth");

router.post("/addquickitem", authMiddleware, async (req, res) => {
  try {
    const { category, name, cost } = req.body;
    const user_id = req.user.id; // Assuming `authMiddleware` attaches `req.user`

    // Validate required f  ields
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
