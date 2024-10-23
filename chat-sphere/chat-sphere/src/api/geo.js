const express = require('express');
const router = express.Router();
const geoController = require('../controllers/geoController');

/**
 * @swagger
 * /geo/share:
 *   post:
 *     summary: Share Location
 *     description: Share the user's geolocation.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: USER_ID
 *               location:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: number
 *                     example: 12.345678
 *                   longitude:
 *                     type: number
 *                     example: 98.765432
 *     responses:
 *       '200':
 *         description: Location shared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Location shared successfully
 */
router.post('/share', geoController.shareLocation);

module.exports = router;
