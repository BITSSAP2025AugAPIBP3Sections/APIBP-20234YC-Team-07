const express = require('express');
const router = express.Router();
const serviceLocatorController = require('../controllers/serviceLocatorController');

/**
 * @swagger
 * /locator/services:
 *   get:
 *     summary: Retrieve nearby pet services
 *     tags: [Service Locator]
 *     responses:
 *       200:
 *         description: List of nearby pet services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 */
router.get('/services', serviceLocatorController.getNearbyServices);

/**
 * @swagger
 * /locator/services/{serviceId}:
 *   get:
 *     summary: Get details of a specific service provider
 *     tags: [Service Locator]
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The service provider ID
 *     responses:
 *       200:
 *         description: Details of the service provider
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 */
router.get('/services/:serviceId', serviceLocatorController.getServiceDetails);

/**
 * @swagger
 * /locator/services/recommend:
 *   post:
 *     summary: Suggest a new service provider
 *     tags: [Service Locator]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServiceRecommendation'
 *     responses:
 *       201:
 *         description: Service provider recommended
 */
router.post('/services/recommend', serviceLocatorController.recommendService);

module.exports = router;