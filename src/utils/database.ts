import { MongoClient, ServerApiVersion } from "mongodb";
import { MONGODB_URI } from "../constants/database";

export const databaseUri = MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const client = new MongoClient(databaseUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
