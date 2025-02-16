const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');

    // Check if token exists
    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const secretKey = "your_secret_key"; // Replace with your actual secret key
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // Attach user data to request object
        next(); // Proceed to the next middleware
    } catch (error) {
        res.status(403).json({ error: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;
