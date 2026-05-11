const express = require('express');
const router = express.Router();

//event routes
const eventController = require('../controllers/eventController');

//POST event
router.post(
    '/events',
    eventController.createEvent
);

module.exports = router;
