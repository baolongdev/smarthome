import { MongoClient, ServerApiVersion, type Db } from "mongodb"

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
}

declare global {
  var mongoClientPromise: Promise<MongoClient> | undefined
}

function getMongoClientPromise() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable")
  }

  if (globalThis.mongoClientPromise) {
    return globalThis.mongoClientPromise
  }

  const clientPromise = new MongoClient(uri, options).connect()
  if (process.env.NODE_ENV !== "production") {
    globalThis.mongoClientPromise = clientPromise
  }

  return clientPromise
}

export async function getMongoDb(): Promise<Db> {
  const connectedClient = await getMongoClientPromise()
  return connectedClient.db(process.env.MONGODB_DB ?? "smarthome")
}
