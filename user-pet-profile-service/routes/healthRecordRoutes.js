// healthRecordRoutes.js

const express = require('express');
const healthRecordController = require('../controllers/healthRecordController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Health Records
 *   description: Manage health records for pets in the Pet Health & Care Management System
 */

/**
 * @swagger
 * /api/health-records/{petId}:
 *   post:
 *     summary: Add a new health record for a pet
 *     description: Add a health record for the pet with the provided pet ID.
 *     tags: [Health Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         description: ID of the pet
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: Description of the health issue or event
 *               vet:
 *                 type: string
 *                 description: Name or ID of the vet who treated the pet
 *               vaccine:
 *                 type: string
 *                 description: Vaccine name or type administered to the pet
 *               dateAdministered:
 *                 type: string
 *                 format: date
 *                 description: Date the vaccine was administered
 *               nextDueDate:
 *                 type: string
 *                 format: date
 *                 description: Date the next vaccine or appointment is due
 *     responses:
 *       201:
 *         description: Health record added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message for adding health record
 *                 healthRecord:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The ID of the health record
 *                     description:
 *                       type: string
 *                       description: Description of the health issue or event
 *                     vet:
 *                       type: string
 *                       description: Name or ID of the vet
 *                     vaccine:
 *                       type: string
 *                       description: Vaccine administered
 *                     dateAdministered:
 *                       type: string
 *                       format: date
 *                       description: Date the vaccine was administered
 *                     nextDueDate:
 *                       type: string
 *                       format: date
 *                       description: Date of next due vaccine or appointment
 *       400:
 *         description: Bad request, invalid data provided
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       404:
 *         description: Pet not found
 *       500:
 *         description: Server error
 */
router.post('/:petId', authMiddleware, healthRecordController.addHealthRecord);

/**
 * @swagger
 * /api/health-records/{petId}:
 *   get:
 *     summary: Get all health records for a pet
 *     description: Get all health records for the pet with the provided pet ID.
 *     tags: [Health Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         description: ID of the pet
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of health records for the pet
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The ID of the health record
 *                   description:
 *                     type: string
 *                     description: Description of the health issue or event
 *                   vet:
 *                     type: string
 *                     description: Name or ID of the vet
 *                   vaccine:
 *                     type: string
 *                     description: Vaccine administered
 *                   dateAdministered:
 *                     type: string
 *                     format: date
 *                     description: Date the vaccine was administered
 *                   nextDueDate:
 *                     type: string
 *                     format: date
 *                     description: Date of next due vaccine or appointment
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       404:
 *         description: Pet not found
 *       500:
 *         description: Server error
 */
router.get('/:petId', authMiddleware, healthRecordController.getAllHealthRecordsForPet);

/**
 * @swagger
 * /api/health-records/{petId}/{recordId}:
 *   get:
 *     summary: Get a specific health record by record ID
 *     description: Get the health record with the provided record ID for the specified pet.
 *     tags: [Health Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         description: ID of the pet
 *         schema:
 *           type: string
 *       - in: path
 *         name: recordId
 *         required: true
 *         description: ID of the health record
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Health record found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the health record
 *                 description:
 *                   type: string
 *                   description: Description of the health issue or event
 *                 vet:
 *                   type: string
 *                   description: Name or ID of the vet
 *                 vaccine:
 *                   type: string
 *                   description: Vaccine administered
 *                 dateAdministered:
 *                   type: string
 *                   format: date
 *                   description: Date the vaccine was administered
 *                 nextDueDate:
 *                   type: string
 *                   format: date
 *                   description: Date of next due vaccine or appointment
 *       404:
 *         description: Health record not found
 *       500:
 *         description: Server error
 */
router.get('/:petId/:recordId', authMiddleware, healthRecordController.getHealthRecordById);

/**
 * @swagger
 * /api/health-records/{petId}/{recordId}:
 *   put:
 *     summary: Update a specific health record by record ID
 *     description: Update the health record with the provided record ID for the specified pet.
 *     tags: [Health Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         description: ID of the pet
 *         schema:
 *           type: string
 *       - in: path
 *         name: recordId
 *         required: true
 *         description: ID of the health record
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: Description of the health issue or event
 *               vet:
 *                 type: string
 *                 description: Name or ID of the vet who treated the pet
 *               vaccine:
 *                 type: string
 *                 description: Vaccine name or type administered to the pet
 *               dateAdministered:
 *                 type: string
 *                 format: date
 *                 description: Date the vaccine was administered
 *               nextDueDate:
 *                 type: string
 *                 format: date
 *                 description: Date the next vaccine or appointment is due
 *     responses:
 *       200:
 *         description: Health record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message for health record update
 *                 healthRecord:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The ID of the health record
 *                     description:
 *                       type: string
 *                       description: Description of the health issue or event
 *                     vet:
 *                       type: string
 *                       description: Name or ID of the vet
 *                     vaccine:
 *                       type: string
 *                       description: Vaccine administered
 *                     dateAdministered:
 *                       type: string
 *                       format: date
 *                       description: Date the vaccine was administered
 *                     nextDueDate:
 *                       type: string
 *                       format: date
 *                       description: Date of next due vaccine or appointment
 *       404:
 *         description: Health record not found
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.put('/:petId/:recordId', authMiddleware, healthRecordController.updateHealthRecord);

/**
 * @swagger
 * /api/health-records/{petId}/{recordId}:
 *   delete:
 *     summary: Delete a specific health record by record ID
 *     description: Delete the health record with the provided record ID for the specified pet.
 *     tags: [Health Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         description: ID of the pet
 *         schema:
 *           type: string
 *       - in: path
 *         name: recordId
 *         required: true
 *         description: ID of the health record
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Health record deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message for health record deletion
 *       404:
 *         description: Health record not found
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       500:
 *         description: Server error
 */
router.delete('/:petId/:recordId', authMiddleware, healthRecordController.deleteHealthRecord);

module.exports = router;
