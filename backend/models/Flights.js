const mongoose = require('mongoose');

const flightRecordSchema = new mongoose.Schema({
    // --- IDENTIFIERS & RELATIONSHIPS ---
    id: {
        type: String,
        required: true,
        unique: true
    },
    flight_number: {
        type: String,
        required: true
    },
    origin_airport_id: {
        type: String, // References the Hub/AirportConfig model
        required: true
    },
    destination_airport_id: {
        type: String, // References the Hub/AirportConfig model
        required: true
    },
    sched_aircraft_type_id: {
        type: String, // References the AircraftConfig model (Planned)
        required: true
    },
    act_aircraft_type_id: {
        type: String, // References the AircraftConfig model (Actual)
        required: true
    },

    // --- SCHEDULED/PLANNED METRICS ---
    scheduled_depart_day: {
        type: Number, // Integer representing the day offset (e.g., 0, 7, 14, 21)
        required: true
    },
    scheduled_depart_hour: {
        type: Number, // Integer (0-23)
        required: true
    },
    scheduled_arrival_day: {
        type: Number, // Integer representing the day offset
        required: true
    },
    scheduled_arrival_hour: {
        type: Number, // Integer (0-23)
        required: true
    },
    distance: {
        type: Number, // Scheduled distance
        required: true
    },
    planned_first_passengers: {
        type: Number
    },
    planned_business_passengers: {
        type: Number
    },
    planned_premium_economy_passengers: {
        type: Number
    },
    planned_economy_passengers: {
        type: Number
    },

    // --- ACTUAL/OUTCOME METRICS ---
    actual_distance: {
        type: Number // Actual distance flown (may differ slightly)
    },
    actual_arival_day: {
        type: Number
    },
    actual_arrival_hour: {
        type: Number
    },
    actual_first_passengers: {
        type: Number
    },
    actual_business_passengers: {
        type: Number
    },
    actual_premium_economy_passengers: {
        type: Number
    },
    actual_economy_passengers: {
        type: Number
    },

}, { timestamps: true });

module.exports = mongoose.model('FlightRecord', flightRecordSchema);