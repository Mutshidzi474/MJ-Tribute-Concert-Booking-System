const express = require('express');
const router = express.Router();

const Booking = require('../models/Booking');
const bookingController = require('../controllers/bookingController');
const { isLoggedIn } = require('../middleware/authMiddleware');

// Route to create a new booking
router.post('/book', isLoggedIn, bookingController.createBooking);

module.exports = router;