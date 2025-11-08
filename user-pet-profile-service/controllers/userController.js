const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        if (error.name === 'ValidationError') {
            // Handle Mongoose validation errors
            const errorMessages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: 'Validation error', errors: errorMessages });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// User login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user profile (authenticated)
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password'); // Exclude password field
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user profile (authenticated)
exports.updateUserProfile = async (req, res) => {
    const { name, email } = req.body;

    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user details
        if (name) user.name = name;
        if (email) user.email = email;
        await user.save();

        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errorMessages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: 'Validation error', errors: errorMessages });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete user account (authenticated)
exports.deleteUserAccount = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');  // Don't send password
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a user (admin only)
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyToken = async (req, res) => {
    try {
        res.status(200).json({ message: 'Token is valid' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the email is already in use
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already in use' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create a new admin user
        const admin = new User({
            name,
            email,
            password: hashedPassword,
            role: 'admin'
        });

        // Save the admin user to the database
        await admin.save();

        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
