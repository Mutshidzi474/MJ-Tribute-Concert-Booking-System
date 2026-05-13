const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    userName: {
        type: String,
        required: true
    },

    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },

    eventName: {
        type: String,
        required: true
    },

    tickets: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        default: 'Confirmed'
    },

    bookingDate: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Booking', bookingSchema);
