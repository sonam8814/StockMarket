import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/stockmarket";

// Create MongoDB client connection
const client = new MongoClient(MONGODB_URI);
const clientPromise = client.connect();

// Get database instance
async function getDatabase() {
  const connectedClient = await clientPromise;
  return connectedClient.db("stockmarket");
}

export const auth = betterAuth({
  database: mongodbAdapter(await getDatabase()),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.d335d6e2278076265ffac97deca3932124bf22efdceadaaa7b15a8fae889279b || "http://localhost:3000",
  trustedOrigins: ["http://localhost:3000"],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
});