const express = require('express');
const adminMiddleware = require('../middleware/adminMiddleware');
const userController = require('../controllers/userController');
const petController = require('../controllers/petController');
const healthRecordController = require('../controllers/healthRecordController');
const preferencesController = require('../controllers/preferencesController');

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Admin
 *     description: Admin management routes
 */

/**
 * @openapi
 * /api/admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized, admin privileges required
 *       500:
 *         description: Server error
 */
router.get('/users', adminMiddleware, userController.getAllUsers);  // View all users

/**
 * @openapi
 * /api/admin/users/{userId}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized, admin privileges required
 *       500:
 *         description: Server error
 */
router.delete('/users/:userId', adminMiddleware, userController.deleteUser);  // Delete a user

/**
 * @openapi
 * /api/admin/pets:
 *   get:
 *     summary: Get all pets (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all pets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pet'
 *       401:
 *         description: Unauthorized, admin privileges required
 *       500:
 *         description: Server error
 */
router.get('/pets', adminMiddleware, petController.getAllPets);  // View all pets

/**
 * @openapi
 * /api/admin/pets/{petId}:
 *   delete:
 *     summary: Delete a pet (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         description: ID of the pet to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pet deleted successfully
 *       404:
 *         description: Pet not found
 *       401:
 *         description: Unauthorized, admin privileges required
 *       500:
 *         description: Server error
 */
router.delete('/pets/:petId', adminMiddleware, petController.deletePet);  // Delete a pet

/**
 * @openapi
 * /api/admin/health-records:
 *   get:
 *     summary: Get all health records (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all health records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HealthRecord'
 *       401:
 *         description: Unauthorized, admin privileges required
 *       500:
 *         description: Server error
 */
router.get('/health-records', adminMiddleware, healthRecordController.getAllHealthRecords);  // View all health records

/**
 * @openapi
 * /api/admin/health-records/{petId}/{recordId}:
 *   delete:
 *     summary: Delete a specific health record for a pet (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         description: ID of the pet the health record belongs to
 *         schema:
 *           type: string
 *       - in: path
 *         name: recordId
 *         required: true
 *         description: ID of the health record to delete
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
 *                   example: Health record deleted successfully
 *       404:
 *         description: Health record or pet not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Health record or pet not found
 *       401:
 *         description: Unauthorized, admin privileges required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */
router.delete('/health-records/:petId/:recordId', adminMiddleware, healthRecordController.deleteHealthRecordForAdmin);  // Delete a health record

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *     Pet:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         breed:
 *           type: string
 *         age:
 *           type: integer
 *         medicalHistory:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/HealthRecord'
 *     HealthRecord:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         description:
 *           type: string
 *         vet:
 *           type: string
 *         vaccine:
 *           type: string
 *         dateAdministered:
 *           type: string
 *           format: date-time
 *         nextDueDate:
 *           type: string
 *           format: date-time
 *     Preferences:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         reminderFrequency:
 *           type: string
 *         notificationType:
 *           type: string
 *         preferredLanguage:
 *           type: string
 *         darkMode:
 *           type: boolean
 *         vaccinationReminders:
 *           type: boolean
 *         appointmentReminders:
 *           type: boolean
 */


/**
 * @openapi
 * /api/admin/create-admin:
 *   post:
 *     summary: Create a new admin account
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Admin's name
 *               email:
 *                 type: string
 *                 description: Admin's email
 *               password:
 *                 type: string
 *                 description: Admin's password
 *     responses:
 *       201:
 *         description: Admin created successfully
 *       400:
 *         description: Email already in use
 *       401:
 *         description: Unauthorized, admin privileges required
 *       403:
 *         description: Access denied, admin only
 *       500:
 *         description: Server error
 */

router.post('/create-admin', adminMiddleware, userController.createAdmin);

module.exports = router;
