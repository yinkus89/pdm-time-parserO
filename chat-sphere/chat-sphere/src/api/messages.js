const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

/**
 * @swagger
 * /chat/send:
 *   post:
 *     summary: Send Message
 *     description: Send a chat message to a user or group.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 example: USER_OR_GROUP_ID
 *               message:
 *                 type: string
 *                 example: Hello!
 *     responses:
 *       '200':
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Message sent successfully
 */
router.post('/send', messageController.sendMessage);

module.exports = router;
