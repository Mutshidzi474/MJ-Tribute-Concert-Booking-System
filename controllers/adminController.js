const adminDashboard = async (req, res) => {
    try {
        const Event = require('../models/Event');
        const totalEvents = await Event.countDocuments();
        res.render('adminDashboard', { totalEvents });
    } catch (error) {
        console.error(error);
        res.status(500).render('adminDashboard', { totalEvents: 0, error: 'Failed to load dashboard' });
    }
};

const manageEvents = async (req, res) => {
    try {
        const Event = require('../models/Event');
        const events = await Event.find().lean();
        res.render('manageEvents', { events });
    } catch (error) {
        console.error(error);
        res.status(500).render('manageEvents', { events: [], error: 'Failed to load events' });
    }
};

const manageUsers = async (req, res) => {
    try {
        const User = require('../models/User');
        const users = await User.find().select('-password').lean();
        res.render('manageUsers', { users });
    } catch (error) {
        console.error(error);
        res.status(500).render('manageUsers', { users: [], error: 'Failed to load users' });
    }
};

module.exports = {

    adminDashboard,
    manageEvents,
    manageUsers

};
