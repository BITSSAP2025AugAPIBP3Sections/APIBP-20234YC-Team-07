const EmergencyAlert = require('../models/EmergencyAlert');
const { validationResult } = require('express-validator');

exports.triggerEmergencyAlert = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { userId, alertType, location, description } = req.body;
        const newAlert = new EmergencyAlert({
            userId,
            alertType,
            location,
            description
        });
        await newAlert.save();
        res.status(201).json(newAlert);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEmergencyAlerts = async (req, res) => {
    const userId = req.params.userId;

    try {
        const alerts = await EmergencyAlert.find({ userId });
        if (!alerts) {
            return res.status(404).json({ message: 'No emergency alerts found for this user' });
        }
        res.status(200).json(alerts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};