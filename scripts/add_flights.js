const fs = require('fs');
const csv = require('csv-parser');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const FILE_PATH = './inputs/csv/flights.csv';
const MONGODB_URI = process.env.MONGODB_URI;
const client = new MongoClient(MONGODB_URI);

async function ingestData() {    
    try {
        await client.connect();
        const db = client.db();

        const results = [];
        await new Promise((resolve, reject) => {
            fs.createReadStream(FILE_PATH)
                .pipe(csv({ separator: ';' }))
                .on('data', (data) => {
                    results.push({
                        id: data.id,
                        flight_number: data.flight_number,
                        origin_airport_id: data.origin_airport_id,
                        destination_airport_id: data.destination_airport_id,
                        sched_aircraft_type_id: data.sched_aircraft_type_id,
                        act_aircraft_type_id: data.act_aircraft_type_id,

                        // --- SCHEDULED/PLANNED METRICS (Numbers) ---
                        scheduled_depart_day: parseInt(data.scheduled_depart_day),
                        scheduled_depart_hour: parseInt(data.scheduled_depart_hour),
                        scheduled_arrival_day: parseInt(data.scheduled_arrival_day),
                        scheduled_arrival_hour: parseInt(data.scheduled_arrival_hour),
                        distance: parseInt(data.distance),

                        // --- ACTUAL/OUTCOME METRICS (Numbers) ---
                        actual_distance: parseFloat(data.actual_distance),
                        actual_arival_day: parseInt(data.actual_arival_day),
                        actual_arrival_hour: parseInt(data.actual_arrival_hour),

                        // Planned Passengers (Numbers)
                        planned_first_passengers: parseInt(data.planned_first_passengers),
                        planned_business_passengers: parseInt(data.planned_business_passengers),
                        planned_premium_economy_passengers: parseInt(data.planned_premium_economy_passengers),
                        planned_economy_passengers: parseInt(data.planned_economy_passengers),

                        // Actual Passengers (Numbers)
                        actual_first_passengers: parseInt(data.actual_first_passengers),
                        actual_business_passengers: parseInt(data.actual_business_passengers),
                        actual_premium_economy_passengers: parseInt(data.actual_premium_economy_passengers),
                        actual_economy_passengers: parseInt(data.actual_economy_passengers),
                    });
                })
                .on('end', () => {
                    console.log(`Finished parsing. Found ${results.length} records.`);
                    resolve();
                })
                .on('error', reject);
        });

        if (results.length > 0) {
            console.log(`Starting sequential insertion of ${results.length} records...`);
            let successfulInserts = 0;
            
            for (const doc of results) {
                try {
                    const existing = await db.collection('flights').findOne({ id: doc.id });
                    if (!existing) {
                        await db.collection('flights').insertOne(doc);
                        successfulInserts++;
                    }
                } catch (e) {
                    // Check for Mongoose unique index violation (error code 11000)
                    if (e.code === 11000) {
                        console.warn(`[WARNING] Skipping duplicate ID: ${doc.id}`);
                    } else {
                        console.error(`[ERROR] Failed to insert document ${doc.id}: ${e.message}`);
                    }
                }
            }
            console.log(`Successfully inserted ${successfulInserts} records into MongoDB.`);
        }

    } catch (error) {
        console.error("Data Ingestion Failed:", error.message);
    } finally {
        await client.close();
    }
}

ingestData();