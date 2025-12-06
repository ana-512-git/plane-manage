const mongoose = require('mongoose');

const airportSchema = new mongoose.Schema({
    id: { 
        type: String, 
        required: true, 
        unique: true 
    },
    code: { 
        type: String, 
        required: true,
        unique: true 
    },
    name: { 
        type: String, 
        required: true 
    },

    // --- PROCESSING TIME (Integer/Minutes) ---
    first_processing_time: { type: Number, required: true },
    business_processing_time: { type: Number, required: true },
    premium_economy_processing_time: { type: Number, required: true },
    economy_processing_time: { type: Number, required: true },

    // --- PROCESSING COST (Float/Monetary) ---
    first_processing_cost: { type: Number, required: true },
    business_processing_cost: { type: Number, required: true },
    premium_economy_processing_cost: { type: Number, required: true },
    economy_processing_cost: { type: Number, required: true },

    // --- LOADING COST (Float/Monetary) ---
    first_loading_cost: { type: Number, required: true },
    business_loading_cost: { type: Number, required: true },
    premium_economy_loading_cost: { type: Number, required: true },
    economy_loading_cost: { type: Number, required: true },

    // --- INITIAL INVENTORY STOCK (Integer/Units) ---
    initial_fc_stock: { type: Number, required: true }, // FC = First Class
    initial_bc_stock: { type: Number, required: true }, // BC = Business Class
    initial_pe_stock: { type: Number, required: true }, // PE = Premium Economy
    initial_ec_stock: { type: Number, required: true }, // EC = Economy Class

    // --- WAREHOUSE CAPACITY LIMITS (Integer/Units) ---
    capacity_fc: { type: Number, required: true },
    capacity_bc: { type: Number, required: true },
    capacity_pe: { type: Number, required: true },
    capacity_ec: { type: Number, required: true },
    
}, { timestamps: true });

module.exports = mongoose.model('AirportSchemaConfig', airportSchema);