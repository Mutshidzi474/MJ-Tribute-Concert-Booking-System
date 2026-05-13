const Event = require('../models/Event');

const normalizeNumber = value => {
    const number = Number(value);
    return Number.isNaN(number) ? null : number;
};

exports.createEvent = async (req, res) => {
    try {
        const { title, date, category, location, description, capacity, price, ticketAvailable } = req.body;
        const parsedCapacity = normalizeNumber(capacity);
        const parsedPrice = normalizeNumber(price);
        const parsedAvailable = normalizeNumber(ticketAvailable);

        if (!title || !date || !location || parsedCapacity === null || parsedPrice === null) {
            return res.status(400).send('Title, date, location, capacity and price are required');
        }

        if (parsedCapacity <= 0 || parsedPrice < 0) {
            return res.status(400).send('Capacity must be greater than 0 and price cannot be negative');
        }

        const availability = parsedAvailable === null ? parsedCapacity : parsedAvailable;
        if (availability < 0 || availability > parsedCapacity) {
            return res.status(400).send('Available tickets must be between 0 and capacity');
        }

        const newEvent = new Event({
            title,
            date,
            category,
            location,
            description,
            capacity: parsedCapacity,
            price: parsedPrice,
            ticketAvailable: availability
        });

        await newEvent.save();
        res.redirect('/events');
    } catch (error) {
        console.error(error);
        res.status(500).send('Unable to create event');
    }
};

exports.getEditEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).lean();
        if (!event) {
            return res.redirect('/events');
        }
        res.render('editEvent', { event });
    } catch (error) {
        console.error(error);
        res.redirect('/events');
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const { title, date, category, location, description, capacity, price, ticketAvailable } = req.body;
        const parsedCapacity = normalizeNumber(capacity);
        const parsedPrice = normalizeNumber(price);
        const parsedAvailable = normalizeNumber(ticketAvailable);

        if (!title || !date || !location || parsedCapacity === null || parsedPrice === null) {
            return res.status(400).send('Title, date, location, capacity and price are required');
        }

        if (parsedCapacity <= 0 || parsedPrice < 0) {
            return res.status(400).send('Capacity must be greater than 0 and price cannot be negative');
        }

        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.redirect('/events');
        }

        const availability = parsedAvailable === null ? event.ticketAvailable : parsedAvailable;
        if (availability < 0 || availability > parsedCapacity) {
            return res.status(400).send('Available tickets must be between 0 and capacity');
        }

        event.title = title;
        event.date = date;
        event.category = category;
        event.location = location;
        event.description = description;
        event.capacity = parsedCapacity;
        event.price = parsedPrice;
        event.ticketAvailable = Math.min(availability, parsedCapacity);

        await event.save();
        res.redirect('/events');
    } catch (error) {
        console.error(error);
        res.status(500).send('Unable to update event');
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.redirect('/events');
    } catch (error) {
        console.error(error);
        res.status(500).send('Unable to delete event');
    }
};

exports.getEvents = async (req, res) => {
    try {
        const { search, dateFrom, dateTo, category, availability } = req.query;
        
        // Build filter object
        let filter = {};
        
        // Search by title or location
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Filter by date range
        if (dateFrom || dateTo) {
            filter.date = {};
            if (dateFrom) {
                filter.date.$gte = new Date(dateFrom);
            }
            if (dateTo) {
                filter.date.$lte = new Date(dateTo);
            }
        }
        
        // Filter by category
        if (category && category !== '') {
            filter.category = category;
        }
        
        // Filter by availability (only events with available tickets)
        if (availability === 'true') {
            filter.ticketAvailable = { $gt: 0 };
        }
        
        const events = await Event.find(filter).sort({ date: 1 }).lean();
        const isAdmin = req.session && req.session.user && req.session.user.role === 'admin';
        
        // Get all categories for filter dropdown
        const allEvents = await Event.find().lean();
        const categories = [...new Set(allEvents.map(e => e.category).filter(c => c))];
        
        if (isAdmin) {
            return res.render('manageEvents', { events });
        }
        
        res.render('events', { 
            events, 
            categories,
            filters: { search, dateFrom, dateTo, category, availability }
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('events', { events: [], error: 'Failed to load events', categories: [], filters: {} });
    }
};
