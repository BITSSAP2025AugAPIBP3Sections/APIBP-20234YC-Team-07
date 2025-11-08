const User = require('../models/User');

// Get the current user's preferences
exports.getUserPreferences = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.preferences || {});
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update the current user's preferences
exports.updateUserPreferences = async (req, res) => {
    const { preferences } = req.body;

    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update preferences with provided data
        user.preferences = { ...user.preferences, ...preferences };
        await user.save();

        res.json({ message: 'Preferences updated successfully', preferences: user.preferences });
    } catch (error) {
        if (error.name === 'ValidationError') {
            // Handle Mongoose validation errors
            const errorMessages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: 'Validation error', errors: errorMessages });
        }
        res.status(500).json({ message: 'Server error' });
        res.status(500).json({ message: 'Server error' });
    }
};

// Reset the current user's preferences to default values
exports.resetUserPreferences = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Reset preferences to an empty or default object
        user.preferences = {};
        await user.save();

        res.json({ message: 'Preferences reset to default', preferences: user.preferences });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
