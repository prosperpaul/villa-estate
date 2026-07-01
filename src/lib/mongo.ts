import { MongoClient, type Db, type MongoClientOptions } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI is not set. Add it to .env.local.");
}

/**
 * In development on Windows, antivirus / SSL-inspection tools sometimes break
 * the TLS handshake to Atlas. These options relax cert verification ONLY in
 * dev. Production keeps strict checks.
 */
const options: MongoClientOptions =
  process.env.NODE_ENV === "development"
    ? { tlsAllowInvalidCertificates: true, tlsAllowInvalidHostnames: true }
    : {};

// Singleton MongoClient. In dev, Next.js hot-reloads modules — we cache the
// client on globalThis so we don't open a new connection on every reload.
let client: MongoClient;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri, options);
  }
  client = global._mongoClient;
} else {
  client = new MongoClient(uri, options);
}

export default client;

export async function getDb(): Promise<Db> {
  return client.db("vilaestate");
}
