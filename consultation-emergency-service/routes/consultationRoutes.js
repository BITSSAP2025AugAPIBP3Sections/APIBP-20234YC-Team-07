const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultationController');

/**
 * @swagger
 * /consultation/schedule:
 *   post:
 *     summary: Schedule a new consultation with a vet
 *     tags: [Consultation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               vetId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Consultation scheduled
 */
router.post('/schedule', consultationController.scheduleConsultation);

/**
 * @swagger
 * /consultation/{consultationId}:
 *   get:
 *     summary: Retrieve details of a specific consultation
 *     tags: [Consultation]
 *     parameters:
 *       - in: path
 *         name: consultationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The consultation ID
 *     responses:
 *       200:
 *         description: Details of consultation
 */
router.get('/:consultationId', consultationController.getConsultation);

/**
 * @swagger
 * /consultation/{consultationId}:
 *   put:
 *     summary: Update consultation details
 *     tags: [Consultation]
 *     parameters:
 *       - in: path
 *         name: consultationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The consultation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               vetId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Consultation updated
 */
router.put('/:consultationId', consultationController.updateConsultation);

/**
 * @swagger
 * /consultation/{consultationId}:
 *   delete:
 *     summary: Cancel a specific consultation
 *     tags: [Consultation]
 *     parameters:
 *       - in: path
 *         name: consultationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The consultation ID
 *     responses:
 *       200:
 *         description: Consultation cancelled
 */
router.delete('/:consultationId', consultationController.cancelConsultation);

/**
 * @swagger
 * /consultation/{consultationId}/start:
 *   post:
 *     summary: Start a video consultation with a vet
 *     tags: [Consultation]
 *     parameters:
 *       - in: path
 *         name: consultationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The consultation ID
 *     responses:
 *       200:
 *         description: Video consultation started
 */
router.post('/:consultationId/start', consultationController.startConsultation);

/**
 * @swagger
 * /user/{userId}/consultations:
 *   get:
 *     summary: Retrieve all consultations for a user
 *     tags: [Consultation]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: List of consultations for the user
 */
router.get('/user/:userId/consultations', consultationController.getUserConsultations);

/**
 * @swagger
 * /consultation/{consultationId}/message:
 *   post:
 *     summary: Send a message to the veterinarian
 *     tags: [Consultation]
 *     parameters:
 *       - in: path
 *         name: consultationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The consultation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message sent
 */
router.post('/:consultationId/message', consultationController.sendMessage);

/**
 * @swagger
 * /consultation/{consultationId}/messages:
 *   get:
 *     summary: Retrieve all messages within a consultation
 *     tags: [Consultation]
 *     parameters:
 *       - in: path
 *         name: consultationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The consultation ID
 *     responses:
 *       200:
 *         description: List of messages for the consultation
 */
router.get('/:consultationId/messages', consultationController.getMessages);

/**
 * @swagger
 * /consultation/{consultationId}/followup:
 *   post:
 *     summary: Schedule a follow-up consultation
 *     tags: [Consultation]
 *     parameters:
 *       - in: path
 *         name: consultationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The consultation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Follow-up consultation scheduled successfully
 */
router.post('/:consultationId/followup', consultationController.scheduleFollowUp);

module.exports = router;