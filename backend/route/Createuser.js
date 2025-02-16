const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Users = require('../model/User');

const SECRET_KEY = 'your_secret_key'; // Change this to a strong secret key

// Register Route
router.post('/create', async (req, res) => {
    const { name, email, password, dob } = req.body;

    let existuser = await Users.findOne({ email });

    if (existuser) {
        return res.status(400).json({ error: "User Already Exists" });
    }

    const newUser = new Users({ name, email, password, dob });
    await newUser.save();
    
    res.status(200).json({ success: "Account Created Successfully" });
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    let user = await Users.findOne({ email });

    if (!user) {
        return res.status(400).json({ error: "Invalid Email or Password" });
    }

    // Check if password matches
    if (user.password !== password) {
        return res.status(400).json({ error: "Invalid Email or Password" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ success: "Login Successful", token,user});
});

module.exports = router;
