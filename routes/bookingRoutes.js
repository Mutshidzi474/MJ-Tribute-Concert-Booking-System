const express = require('express');
const router = express.Router();

const Booking = require('../models/Booking');
const Event = require('../models/Event');
const bookingController = require('../controllers/bookingController');
const { isLoggedIn } = require('../middleware/authMiddleware');

const seedDefaultEvents = async () => {
    const count = await Event.countDocuments();
    if (count === 0) {
        const defaults = [
            {
                title: 'Michael Jackson Tribute Live',
                date: new Date('2026-12-15'),
                category: 'Tribute',
                location: 'Johannesburg Dome',
                description: 'A high-energy Michael Jackson tribute concert.',
                capacity: 500,
                price: 450,
                ticketAvailable: 200
            },
            {
                title: 'Thriller Night Experience',
                date: new Date('2027-01-20'),
                category: 'Pop',
                location: 'Cape Town Arena',
                description: 'A thrilling night of MJ hits and dance routines.',
                capacity: 600,
                price: 550,
                ticketAvailable: 250
            },
            {
                title: 'Smooth Criminal Showcase',
                date: new Date('2027-02-10'),
                category: 'Pop',
                location: 'Durban Stadium',
                description: 'A live show featuring iconic Michael Jackson tracks.',
                capacity: 400,
                price: 500,
                ticketAvailable: 180
            },
            {
                title: 'Billie Jean Dance Party',
                date: new Date('2027-03-05'),
                category: 'Dance',
                location: 'Pretoria Concert Hall',
                description: 'An unforgettable dance party celebrating MJ music.',
                capacity: 450,
                price: 400,
                ticketAvailable: 220
            },
            {
                title: 'Moonwalk Memories',
                date: new Date('2027-04-12'),
                category: 'Tribute',
                location: 'East London Theatre',
                description: 'A special tribute to the King of Pop.',
                capacity: 350,
                price: 480,
                ticketAvailable: 160
            }
        ];
        await Event.insertMany(defaults);
    } else {
        // Update existing events with low prices to at least 400
        await Event.updateMany({ price: { $lt: 400 } }, { $set: { price: 400 + Math.floor(Math.random() * 201) } });
    }
};

router.get('/book-ticket', async (req, res) => {
    await seedDefaultEvents();
    const events = await Event.find().sort({ date: 1 }).limit(5).lean();
    res.render('bookTicket', { events });
});
router.get('/book', isLoggedIn, async (req, res) => {
    await seedDefaultEvents();
    const events = await Event.find().sort({ date: 1 }).lean();
    res.render('bookticket', { events });
});
router.get('/bookings', isLoggedIn, async (req, res) => {
    const bookings = await Booking.find({ user: req.session.userId })
        .populate('eventId')
        .sort({ bookingDate: -1 })
        .lean();

    const allEvents = await Event.find().lean();
    const eventMap = allEvents.reduce((map, event) => {
        map[event.title] = event;
        return map;
    }, {});

    const enrichedBookings = bookings.map(booking => {
        const event = booking.eventId || eventMap[booking.eventName] || null;
        return {
            ...booking,
            event
        };
    });

    res.render('bookings', { bookings: enrichedBookings });
});

router.get('/download-tickets', isLoggedIn, async (req, res) => {
    const bookings = await Booking.find({ user: req.session.userId })
        .populate('eventId')
        .sort({ bookingDate: -1 })
        .lean();

    const allEvents = await Event.find().lean();
    const eventMap = allEvents.reduce((map, event) => {
        map[event.title] = event;
        return map;
    }, {});

    const lines = [];
    lines.push('Ticket Summary');
    lines.push('===================');
    lines.push(`Generated: ${new Date().toLocaleString('en-GB')}`);
    lines.push('');

    if (!bookings.length) {
        lines.push('No bookings found.');
    } else {
        bookings.forEach((booking, index) => {
            const event = booking.eventId || eventMap[booking.eventName] || {};
            const eventDate = event.date ? new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';
            const price = event.price != null ? `${event.price} ZAR` : 'N/A';
            const total = event.price != null ? `${event.price * booking.tickets} ZAR` : 'N/A';

            lines.push(`Booking ${index + 1}:`);
            lines.push(`Concert: ${event.title || booking.eventName || 'Unknown Event'}`);
            lines.push(`Date: ${eventDate}`);
            lines.push(`Location: ${event.location || 'Unknown Location'}`);
            lines.push(`Tickets: ${booking.tickets}`);
            lines.push(`Price per ticket: ${price}`);
            lines.push(`Total cost: ${total}`);
            lines.push(`Status: ${booking.status}`);
            lines.push(`Booked by: ${booking.userName || 'N/A'}`);
            lines.push('---------------------------');
        });
    }

    const content = lines.join('\r\n');
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename="ticket-details.txt"');
    res.send(content);
});

// Route to create a new booking
router.post('/book', isLoggedIn, bookingController.createBooking);

router.post('/cancel/:id', isLoggedIn, async (req, res) => {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.session.userId });
    if (!booking) {
        return res.redirect('/bookings');
    }

    if (booking.eventId) {
        const event = await Event.findById(booking.eventId);
        if (event) {
            event.ticketAvailable = (event.ticketAvailable || 0) + booking.tickets;
            await event.save();
        }
    } else if (booking.eventName) {
        const event = await Event.findOne({ title: booking.eventName });
        if (event) {
            event.ticketAvailable = (event.ticketAvailable || 0) + booking.tickets;
            await event.save();
        }
    }

    await booking.deleteOne();
    res.redirect('/dashboard');
});

module.exports = router;
