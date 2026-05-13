const Contact = require('../models/Contact');

// Get contact form page
exports.getContactForm = (req, res) => {
    res.render('contact');
};

// Submit contact form
exports.submitContact = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).send('Name, email, subject, and message are required');
        }

        const newContact = new Contact({
            name,
            email,
            phone,
            subject,
            message
        });

        await newContact.save();
        res.status(200).render('contact', { 
            success: 'Thank you for your enquiry. We will respond soon!' 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Unable to submit enquiry');
    }
};

// Get all enquiries (Admin only)
exports.getAllEnquiries = async (req, res) => {
    try {
        const enquiries = await Contact.find().sort({ createdAt: -1 }).lean();
        res.render('manageEnquiries', { enquiries });
    } catch (error) {
        console.error(error);
        res.status(500).render('manageEnquiries', { 
            enquiries: [], 
            error: 'Failed to load enquiries' 
        });
    }
};

// Get single enquiry detail (Admin only)
exports.getEnquiryDetail = async (req, res) => {
    try {
        const enquiry = await Contact.findById(req.params.id).lean();
        if (!enquiry) {
            return res.status(404).send('Enquiry not found');
        }
        res.render('enquiryDetail', { enquiry });
    } catch (error) {
        console.error(error);
        res.status(500).send('Unable to load enquiry details');
    }
};

// Mark enquiry as read (Admin only)
exports.markAsRead = async (req, res) => {
    try {
        await Contact.findByIdAndUpdate(req.params.id, { status: 'read' });
        res.redirect(`/admin/enquiries/${req.params.id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Unable to update enquiry');
    }
};

// Mark enquiry as replied (Admin only)
exports.markAsReplied = async (req, res) => {
    try {
        await Contact.findByIdAndUpdate(req.params.id, { status: 'replied' });
        res.redirect(`/admin/enquiries/${req.params.id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Unable to update enquiry');
    }
};

// Delete enquiry (Admin only)
exports.deleteEnquiry = async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.redirect('/admin/enquiries');
    } catch (error) {
        console.error(error);
        res.status(500).send('Unable to delete enquiry');
    }
};
