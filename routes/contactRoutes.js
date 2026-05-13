const express = require('express');
const router = express.Router();

const contactController = require('../controllers/contactController');
const { isAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/contact', contactController.getContactForm);
router.post('/contact', contactController.submitContact);

// Admin routes
router.get('/admin/enquiries', isAdmin, contactController.getAllEnquiries);
router.get('/admin/enquiries/:id', isAdmin, contactController.getEnquiryDetail);
router.post('/admin/enquiries/:id/read', isAdmin, contactController.markAsRead);
router.post('/admin/enquiries/:id/replied', isAdmin, contactController.markAsReplied);
router.post('/admin/enquiries/:id/delete', isAdmin, contactController.deleteEnquiry);

module.exports = router;
