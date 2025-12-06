const fs = require('fs');
const csv = require('csv-parser');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const FILE_PATH = './inputs/csv/airports_with_stocks.csv';
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
                        code: data.code,
                        name: data.name,

                        first_processing_time: parseInt(data.first_processing_time),
                        business_processing_time: parseInt(data.business_processing_time),
                        premium_economy_processing_time: parseInt(data.premium_economy_processing_time),
                        economy_processing_time: parseInt(data.economy_processing_time),

                        first_processing_cost: parseFloat(data.first_processing_cost),
                        business_processing_cost: parseFloat(data.business_processing_cost),
                        premium_economy_processing_cost: parseFloat(data.premium_economy_processing_cost),
                        economy_processing_cost: parseFloat(data.economy_processing_cost),

                        first_loading_cost: parseFloat(data.first_loading_cost),
                        business_loading_cost: parseFloat(data.business_loading_cost),
                        premium_economy_loading_cost: parseFloat(data.premium_economy_loading_cost),
                        economy_loading_cost: parseFloat(data.economy_loading_cost),

                        initial_fc_stock: parseInt(data.initial_fc_stock),
                        initial_bc_stock: parseInt(data.initial_bc_stock),
                        initial_pe_stock: parseInt(data.initial_pe_stock),
                        initial_ec_stock: parseInt(data.initial_ec_stock),

                        capacity_fc: parseInt(data.capacity_fc),
                        capacity_bc: parseInt(data.capacity_bc),
                        capacity_pe: parseInt(data.capacity_pe),
                        capacity_ec: parseInt(data.capacity_ec)
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
                    const existing = await db.collection('airports').findOne({ id: doc.id });
                    if (!existing) {
                        await db.collection('airports').insertOne(doc);
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