const fs = require('fs');
const csv = require('csv-parser');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const FILE_PATH = './inputs/csv/aircraft_types.csv';
const MONGODB_URI = process.env.MONGODB_URI;
const client = new MongoClient(MONGODB_URI);

async function ingestData() {
    console.log("Starting MongoDB connection...");
    
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
                        type_code: data.type_code,
                        first_class_seats: parseInt(data.first_class_seats),
                        business_seats: parseInt(data.business_seats),
                        premium_economy_seats: parseInt(data.premium_economy_seats),
                        economy_seats: parseInt(data.economy_seats),
                        cost_per_kg_per_km: parseFloat(data.cost_per_kg_per_km),
                        first_class_kits_capacity: parseInt(data.first_class_kits_capacity),
                        business_kits_capacity: parseInt(data.business_kits_capacity),
                        premium_economy_kits_capacity: parseInt(data.premium_economy_kits_capacity),
                        economy_kits_capacity: parseInt(data.economy_kits_capacity),
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
                    const existing = await db.collection('aircrafts').findOne({ id: doc.id });
                    if (!existing) {
                        await db.collection('aircrafts').insertOne(doc);
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