const express = require('express');
const preferencesController = require('../controllers/preferencesController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Preferences
 *   description: Manage user preferences for the Pet Health & Care Management System
 */

/**
 * @swagger
 * /api/preferences:
 *   get:
 *     summary: Get the current user's preferences
 *     description: Fetch the preferences set by the currently authenticated user.
 *     tags: [Preferences]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched the user's preferences
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reminderFrequency:
 *                   type: string
 *                   description: Frequency of reminders for the user (e.g., "daily", "weekly", etc.)
 *                 notificationType:
 *                   type: string
 *                   description: Type of notification the user prefers (e.g., "email", "sms")
 *                 preferredLanguage:
 *                   type: string
 *                   description: Preferred language for the user
 *                 darkMode:
 *                   type: boolean
 *                   description: Indicates if dark mode is enabled
 *                 vaccinationReminders:
 *                   type: boolean
 *                   description: Whether the user wants to receive vaccination reminders
 *                 appointmentReminders:
 *                   type: boolean
 *                   description: Whether the user wants to receive appointment reminders
 *                 _id:
 *                   type: string
 *                   description: The unique identifier for the user's preferences
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       500:
 *         description: Server error
 */
router.get('/', authMiddleware, preferencesController.getUserPreferences);

/**
 * @swagger
 * /api/preferences:
 *   put:
 *     summary: Update the current user's preferences
 *     description: Update the preferences for the currently authenticated user.
 *     tags: [Preferences]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reminderFrequency:
 *                 type: string
 *                 description: Frequency of reminders for the user (e.g., "daily", "weekly", etc.)
 *               notificationType:
 *                 type: string
 *                 description: Type of notification the user prefers (e.g., "email", "sms")
 *               preferredLanguage:
 *                 type: string
 *                 description: Preferred language for the user
 *               darkMode:
 *                 type: boolean
 *                 description: Indicates if dark mode is enabled
 *               vaccinationReminders:
 *                 type: boolean
 *                 description: Whether the user wants to receive vaccination reminders
 *               appointmentReminders:
 *                 type: boolean
 *                 description: Whether the user wants to receive appointment reminders
 *     responses:
 *       200:
 *         description: Successfully updated the user's preferences
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message for preference update
 *                 preferences:
 *                   type: object
 *                   properties:
 *                     reminderFrequency:
 *                       type: string
 *                       description: Frequency of reminders for the user
 *                     notificationType:
 *                       type: string
 *                       description: Type of notification the user prefers
 *                     preferredLanguage:
 *                       type: string
 *                       description: Preferred language for the user
 *                     darkMode:
 *                       type: boolean
 *                       description: Whether dark mode is enabled
 *                     vaccinationReminders:
 *                       type: boolean
 *                       description: Whether vaccination reminders are enabled
 *                     appointmentReminders:
 *                       type: boolean
 *                       description: Whether appointment reminders are enabled
 *                     _id:
 *                       type: string
 *                       description: The unique identifier for the preferences
 *       400:
 *         description: Bad request, invalid data provided
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       500:
 *         description: Server error
 */
router.put('/', authMiddleware, preferencesController.updateUserPreferences);

/**
 * @swagger
 * /api/preferences:
 *   delete:
 *     summary: Reset the current user's preferences to default
 *     description: Reset all preferences for the currently authenticated user to the default settings.
 *     tags: [Preferences]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully reset the user's preferences to default
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       500:
 *         description: Server error
 */
router.delete('/', authMiddleware, preferencesController.resetUserPreferences);

module.exports = router;
