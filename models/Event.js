const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: String,
    date: Date,
    category: String,
    location: String,
    description: String,
    capacity: Number,
    price: Number,
    ticketAvailable: Number

});

module.exports = mongoose.model('Event', eventSchema);
