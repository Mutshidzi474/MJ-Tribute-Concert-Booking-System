//Event Schema
const eventSchema = new mongoose.Schema({
    bookingID: { type: String, required: true, unique: true },
    eventType: { type: String, required: true },
    headliner: { type: String, required: true },
    managerID: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: Date, required: true },
    venue: { type: String, required: true },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;