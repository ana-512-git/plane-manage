const fs = require('fs');
const csv = require('csv-parser');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const FILE_PATH = './inputs/csv/flight_plan.csv';
const MONGODB_URI = process.env.MONGODB_URI;
const client = new MongoClient(MONGODB_URI);

function getOperatingDays(data) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const operatingDays = [];
    days.forEach(day => {
        if (data[day] === '1' || data[day] === 1) { 
            operatingDays.push(day);
        }
    });

    return operatingDays;
}


async function ingestData() {    
    try {
        await client.connect();
        const db = client.db();

        const results = [];
        let cnt = 0;
        await new Promise((resolve, reject) => {
            fs.createReadStream(FILE_PATH)
                .pipe(csv({ separator: ';' }))
                .on('data', (data) => {
                    results.push({
                        id: cnt++,
                        depart_code: data.depart_code,
                        arrival_code: data.arrival_code,
                        scheduled_hour: parseInt(data.scheduled_hour),
                        scheduled_arrival_hour: parseInt(data.scheduled_arrival_hour),
                        arrival_next_day: parseInt(data.arrival_next_day),
                        distance_km: parseInt(data.distance_km),
                        days: getOperatingDays(data)
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
                    const existing = await db.collection('flight_plans').findOne({ id: doc.id });
                    if (!existing) {
                        await db.collection('flight_plans').insertOne(doc);
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