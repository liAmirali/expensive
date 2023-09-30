import { config } from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";
import { DB_PASSWORD, DB_USER } from "../constants/database";

export const databaseUri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@expensivecluster.khrpja3.mongodb.net/expensive?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const client = new MongoClient(databaseUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
