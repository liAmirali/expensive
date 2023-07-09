require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@expensivecluster.khrpja3.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const dbConnect = async () => {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to mongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
};
