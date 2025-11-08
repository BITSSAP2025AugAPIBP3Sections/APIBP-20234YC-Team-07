const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Assuming the User model exists

// Middleware to check if user is an admin
const adminMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied, admin privileges required' });
        }
        
        req.user = user;  // Attach the user to the request object
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token or no token provided' });
    }
};

module.exports = adminMiddleware;
