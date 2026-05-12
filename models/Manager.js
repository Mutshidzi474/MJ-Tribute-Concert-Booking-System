//Manager Schema
const managerSchema = new mongoose.Schema({
    managerID: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactNumber: { type: Number, required: true },
    Company: { type: String, required: true },
});

const Manager = mongoose.model('Manager', managerSchema);

module.exports = Manager;