const mongoose = require('mongoose');

const flightPlanSchema = new mongoose.Schema({
    depart_code: { 
        type: String, 
        required: true 
    }, // e.g., HUB1
    arrival_code: { 
        type: String, 
        required: true 
    }, // e.g., ZHVK
    distance_km: { 
        type: Number, 
        required: true 
    }, 

    // --- SCHEDULE DETAILS ---
    scheduled_hour: { 
        type: Number,
        required: true 
    },
    scheduled_arrival_hour: { 
        type: Number, 
        required: true 
    },
    // Flag to indicate if arrival time spills over to the next day (0 or 1)
    arrival_next_day: { 
        type: Number, 
        required: true 
    }, 

    // --- DAYS OF OPERATION (Boolean Flags: 1=Operates, 0=Does Not Operate) ---
    days: { 
        type: [String], 
        required: true 
    },
}, { 
    timestamps: true 
});

module.exports = mongoose.model('FlightPlan', flightPlanSchema);