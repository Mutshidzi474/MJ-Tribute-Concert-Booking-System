const Booking = require('../models/Booking');
const Event = require('../models/Event');

// Create a new booking
exports.createBooking = async (req, res) => {
    try {
        const { eventId, ticketsBooked } = req.body;

        // Find the event by ID
        const event = await Event.findById(eventId);

        //check if the event exists
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        //Check availability of tickets
        if (event.ticketsAvailable < ticketsBooked) {
            return res.status(400).json({ message: 'Not enough tickets available' });
        }
    

        //Reduce the number of available tickets for the event
        event.ticketsAvailable -= ticketsBooked;
        await event.save();

        //Create a new booking
        const booking = new Booking({
            user: req.session.userId,
            event: eventId,
            ticketsBooked: ticketsBooked
        });
        await booking.save();
        res.status(201).json({ message: 'Booking created successfully', booking });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating booking' });
    }
};

// Get all bookings for the logged-in user
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.session.userId }).populate('event');
        res.status(200).json({ bookings });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching bookings' });
    }
};