const Event = require('../models/Event');

exports.adminDashboard = async (req, res) => {
    const totalEvents = await Event.countDocuments();
    res.render('adminDashboard', { totalEvents });
};

exports.manageEvents = async (req, res) => {
    const events = await Event.find().sort({ date: 1 }).lean();
    res.render('manageEvents', { events });
};

exports.manageUsers = async (req, res) => {
    res.render('manageUsers');
};
