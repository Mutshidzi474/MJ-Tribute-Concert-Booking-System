const express = require('express');
const router = express.Router();

const eventController = require('../controllers/eventController');
const { isAdmin } = require('../middleware/authMiddleware');

router.post('/events/create', isAdmin, eventController.createEvent);
router.get('/events/edit/:id', isAdmin, eventController.getEditEvent);
router.post('/events/:id/update', isAdmin, eventController.updateEvent);
router.post('/events/:id/delete', isAdmin, eventController.deleteEvent);

module.exports = router;
