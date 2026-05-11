exports.createEvent = (req, res) => {
    const { name, date, location } = req.body;
    const newEvent = {
        id: Date.now(),
        name,
        date,
        location
    };
    // Here you would typically save the newEvent to a database
    console.log('Event created:', newEvent);
    res.status(201).json({ message: 'Event created successfully', event: newEvent });
};
