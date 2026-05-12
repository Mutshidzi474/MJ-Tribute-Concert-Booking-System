//booking schema
const bookingSchema = new mongoose.Schema({
    bookingID: { type: String, required: true, unique: true },
    userID: { type: Int16Array, required: true },
    eventID: { type: Int16Array, required: true },
    price: { type: Number, required: true },
    bookingDate: { type: Date, required: true },
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;