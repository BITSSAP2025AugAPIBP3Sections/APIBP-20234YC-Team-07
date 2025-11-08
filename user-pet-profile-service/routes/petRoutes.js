const express = require('express');
const petController = require('../controllers/petController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Pets
 *   description: Pet management and retrieval for users
 */

/**
 * @swagger
 * /api/pets:
 *   post:
 *     summary: Add a new pet
 *     tags: [Pets]
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
 *               species:
 *                 type: string
 *               breed:
 *                 type: string
 *               age:
 *                 type: number
 *             required:
 *               - name
 *               - species
 *     responses:
 *       201:
 *         description: Pet added successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, petController.addPet);

/**
 * @swagger
 * /api/pets:
 *   get:
 *     summary: Get all pets for the authenticated user
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of pets owned by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   species:
 *                     type: string
 *                   breed:
 *                     type: string
 *                   age:
 *                     type: number
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', authMiddleware, petController.getAllPetsForUser);

/**
 * @swagger
 * /api/pets/{petId}:
 *   get:
 *     summary: Get details of a specific pet by ID
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the pet to retrieve
 *     responses:
 *       200:
 *         description: Pet details retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Pet not found
 *       500:
 *         description: Server error
 */
router.get('/:petId', authMiddleware, petController.getPetById);

/**
 * @swagger
 * /api/pets/{petId}:
 *   put:
 *     summary: Update details of a specific pet
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the pet to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               species:
 *                 type: string
 *               breed:
 *                 type: string
 *               age:
 *                 type: number
 *     responses:
 *       200:
 *         description: Pet details updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Pet not found
 *       500:
 *         description: Server error
 */
router.put('/:petId', authMiddleware, petController.updatePet);

/**
 * @swagger
 * /api/pets/{petId}:
 *   delete:
 *     summary: Delete a specific pet
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the pet to delete
 *     responses:
 *       200:
 *         description: Pet deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Pet not found
 *       500:
 *         description: Server error
 */
router.delete('/:petId', authMiddleware, petController.deletePet);

module.exports = router;
