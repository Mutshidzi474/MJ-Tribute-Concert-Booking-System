const express = require('express');
const router = express.Router();
const {adminDashboard, manageEvents, manageUsers} = require('../controllers/adminController');
const adminMiddleware = require('../middleware/adminMiddleware');

// Admin dashboard route
router.get('/admin/dashboard', adminMiddleware, adminDashboard);

// Route to manage events
router.get('/events', adminMiddleware, manageEvents);

// Route to manage users
router.get('/users', adminMiddleware, manageUsers);

module.exports = router;
