const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergencyController');

/**
 * @swagger
 * /alerts/emergency:
 *   post:
 *     summary: Trigger an emergency alert
 *     tags: [Emergency]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               alertType:
 *                 type: string
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Emergency alert triggered
 */
router.post('/emergency', emergencyController.triggerEmergencyAlert);

/**
 * @swagger
 * /alerts/{userId}:
 *   get:
 *     summary: Retrieve all emergency alerts relevant to a user’s location
 *     tags: [Emergency]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: List of emergency alerts
 */
router.get('/:userId', emergencyController.getEmergencyAlerts);

module.exports = router;