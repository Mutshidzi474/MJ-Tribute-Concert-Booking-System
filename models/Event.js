//Event Schema
const eventSchema = new mongoose.Schema({
    bookingID: { type: Int16Array, required: true, unique: true },
    eventType: { type: String, required: true },
    headliner: { type: String, required: true },
    manager: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;