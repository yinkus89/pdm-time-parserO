const express = require('express');
const router = express.Router();
const authRoutes = require('../api/auth');
const userRoutes = require('../api/users');
const messageRoutes = require('../api/messages');
const geoRoutes = require('../api/geo');

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/chat', messageRoutes);
router.use('/geo', geoRoutes);

module.exports = router;
