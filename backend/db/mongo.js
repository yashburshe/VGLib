import { MongoClient, ServerApiVersion } from "mongodb";

// process.loadEnvFile();

const DB_URL = process.env.MONGODB_URI;
const DB_NAME = "VGLIB";

export const COLLECTIONS = {
  USERS: "users",
  VIDEOGAMES: "games",
  LISTS: "lists",
};

const client = new MongoClient(DB_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const db = client.db(DB_NAME);

async function run() {
  console.log("Attempting to connect to MongoDB...");
  // Connect the client to the server (optional starting in v4.7)
  await client.connect();
  // Send a ping to confirm a successful connection
  await client.db("admin").command({ ping: 1 });
  console.log("Successfully connected to MongoDB!");
}

run();
