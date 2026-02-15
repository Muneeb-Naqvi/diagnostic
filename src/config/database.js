import { MongoClient } from "mongodb"

let client
let clientPromise

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB_NAME

if (!uri) {
  throw new Error("❌ MONGODB_URI is not defined in .env.local")
}

if (!dbName) {
  throw new Error("❌ MONGODB_DB_NAME is not defined in .env.local")
}

/**
 * Global caching (Next.js hot reload safe)
 */
if (!global._mongoClientPromise) {
  client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    socketTimeoutMS: 45000,
    retryWrites: true,
    retryReads: true,
  })

  console.log("[DB] Connecting to MongoDB Atlas...")
  console.log("[DB] URI:", uri.replace(/mongodb\+srv:\/\/([^:]+):(.+)@/, "mongodb+srv://$1:****@"))
  
  global._mongoClientPromise = client.connect()
    .then(client => {
      console.log("[DB] ✓ MongoDB Atlas connected successfully")
      return client
    })
    .catch(err => {
      console.error("[DB] ✗ MongoDB connection error:", err.message)
      throw err
    })
}

clientPromise = global._mongoClientPromise

/**
 * Get Database (Atlas only)
 */
export async function getDB() {
  try {
    const client = await clientPromise
    const db = client.db(dbName)

    // Test connection
    await db.command({ ping: 1 })
    
    console.log("[DB] Connected to MongoDB Atlas")
    console.log("[DB] Database Name:", db.databaseName)

    return db
  } catch (error) {
    console.error("[DB] Error getting database:", error)
    throw error
  }
}

/**
 * Optional: Get raw client
 */
export async function getClient() {
  return await clientPromise
}

export default getDB
