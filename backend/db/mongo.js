import {MongoClient, ServerApiVersion} from "mongodb";

const DB_URL = process.env.MONGODB_URI || "mongodb://localhost:27017"
const DB_NAME = "vg-lib"

let db_client = null;

export async function connectDB() {
    if (db_client) {
        return db_client;
    }
    
    try {
        const client = new MongoClient(DB_URL, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        await client.connect();
        console.log("Successfully Connected to MongoDatabase!");
        db_client = client.db(DB_NAME);
        return database;
    } catch(err) {
        console.error(error);
        process.exit(1);
    }
}

export function getDB() {
    if (!db_client) {
        console.error("Database not instantiated!");
    } 
    return db_client;
}