const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const admin = require('./firebase'); // Import Firebase Admin
const connectDB = require('./db'); // Connect to MongoDB
const User = require('./model/User'); // Import User model

dotenv.config();
const app = express();
const port = 4000;

// Connect to Database
connectDB();

// Middleware
app.use(cors({ origin: '*' })); // Change '*' to a specific domain in production
app.use(express.json());

// ✅ Google Sign-In Route
app.post('/api/auth/google', async (req, res) => {
    const { idToken } = req.body;

    try {
        // Verify Firebase ID Token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { email, name } = decodedToken;
console.log(email)

        // Check if the user exists in MongoDB
        let user = await User.findOne({ email });

        if (!user) {
            // If user does not exist, create a new user
            user = new User({ name, email, password: '', dob: new Date() }); // DOB can be updated later
            await user.save();
        }
        // Generate JWT token for session
        const jwtToken = jwt.sign({ id: user._id }, "your_secret_key", { expiresIn: '1h' });

        res.json({ success: true, token: jwtToken, user });
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: 'Invalid Google Token' });
    }
});

// ✅ Basic Route
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api',require('./route/Createuser'));
app.use('/api',require('./route/Transaction'));
app.use('/api',require('./route/Quickaccess'));

// ✅ API Routes
app.use('/api/user', require('./route/Createuser'));
app.use('/api/transaction', require('./route/Transaction'));
app.use('/api/quickaccess', require('./route/Quickaccess'));

// ✅ Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
