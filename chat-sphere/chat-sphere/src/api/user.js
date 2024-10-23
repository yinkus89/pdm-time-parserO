const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * @swagger
 * /user/{id}/profile:
 *   get:
 *     summary: Get User Profile
 *     description: Retrieve user profile data.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: USER_ID
 *                 name:
 *                   type: string
 *                   example: User Name
 *                 profilePicture:
 *                   type: string
 *                   example: URL_TO_PROFILE_PICTURE
 */
router.get('/:id/profile', userController.getUserProfile);

module.exports = router;
