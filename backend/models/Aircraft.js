const mongoose = require('mongoose');

const aircraftSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    type_code: { type: String, required: true },
    first_class_seats: { type: Number, required: true },
    business_seats: { type: Number, required: true },
    premium_economy_seats: { type: Number, required: true },
    economy_seats: { type: Number, required: true },
    cost_per_kg_per_km: { type: Number, required: true },
    first_class_kits_capacity: { type: Number },
    business_kits_capacity: { type: Number },
    premium_economy_kits_capacity: { type: Number },
    economy_kits_capacity: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Aircraft', aircraftSchema);