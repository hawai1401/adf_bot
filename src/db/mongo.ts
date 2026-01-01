import { Db, MongoClient } from "mongodb";
import "dotenv/config"

const client = new MongoClient(process.env.MONGODB as string);
let db: Db | undefined;

export async function connect() {
  await client.connect();
  db = client.db("ADF-Bot");
}

export function getDb() {
  if (!db) throw new Error("Db non connectée");
  return db;
}
