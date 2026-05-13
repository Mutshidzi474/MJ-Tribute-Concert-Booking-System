const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
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

router.get('/dashboard', async (req, res) => {
    await seedDefaultEvents();
    const locals = {
        user: null,
        totalBookings: 0,
        ticketsPurchased: 0,
        upcomingEvents: 0
    };

    if (req.session && req.session.user) {
        locals.user = req.session.user;
    } else if (req.session && req.session.userId) {
        locals.user = await User.findById(req.session.userId).lean();
    }

    if (req.session && req.session.userId) {
        const userId = new mongoose.Types.ObjectId(req.session.userId);
        locals.totalBookings = await Booking.countDocuments({ user: userId });

        const tickets = await Booking.aggregate([
            { $match: { user: userId } },
            { $group: { _id: null, total: { $sum: '$tickets' } } }
        ]);
        locals.ticketsPurchased = tickets[0] ? tickets[0].total : 0;

        // Fetch user's bookings
        const userBookings = await Booking.find({ user: userId }).sort({ createdAt: -1 }).lean();

        // Fetch all events to map by title for old bookings
        const allEvents = await Event.find().lean();
        const eventMap = {};
        allEvents.forEach(event => {
            eventMap[event.title] = event;
        });

        // Attach event details to bookings
        locals.bookings = userBookings.map(booking => {
            let event = null;
            if (booking.eventId) {
                // For new bookings, find by ID
                event = allEvents.find(e => e._id.toString() === booking.eventId.toString());
            } else if (booking.eventName) {
                // For old bookings, find by name
                event = eventMap[booking.eventName];
            }
            return {
                ...booking,
                event: event
            };
        });
    }

    const events = await Event.find().sort({ date: 1 }).limit(5).lean();
    locals.upcomingEvents = events.length;
    locals.events = events;

    res.render('dashboard', locals);
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

router.get('/admin-dashboard', (req, res) => {
    res.render('adminDashboard');
});

module.exports = router;
