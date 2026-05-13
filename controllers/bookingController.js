const Booking = require('../models/Booking');
const Event = require('../models/Event');

// Create a new booking
exports.createBooking = async (req, res) => {
    try {
        const { userName, eventId, tickets } = req.body;

        const events = await Event.find().sort({ date: 1 }).limit(5).lean();

        if (!userName || !eventId || !tickets) {
            return res.status(400).render('bookticket', { error: 'All fields are required', events });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(400).render('bookticket', { error: 'Selected event is not available', events });
        }

        const ticketCount = Number(tickets);
        if (ticketCount <= 0) {
            return res.status(400).render('bookticket', { error: 'Please select a valid ticket quantity', events });
        }

        if (event.ticketAvailable != null && ticketCount > event.ticketAvailable) {
            return res.status(400).render('bookticket', { error: 'Not enough tickets remaining for this event', events });
        }

        const booking = new Booking({
            user: req.session.userId,
            userName,
            eventId: eventId,
            eventName: event.title,
            tickets: ticketCount
        });

        await booking.save();

        if (event.ticketAvailable != null) {
            event.ticketAvailable -= ticketCount;
            await event.save();
        }

        res.redirect('/dashboard');
    }
    catch (error) {
        console.error(error);
        const events = await Event.find().sort({ date: 1 }).limit(5).lean();
        res.status(500).render('bookticket', { error: 'Error creating booking', events });
    }
};

// Get all bookings for the logged-in user
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.session.userId });
        res.status(200).json({ bookings });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching bookings' });
    }
};
