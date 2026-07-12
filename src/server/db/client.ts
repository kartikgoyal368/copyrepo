import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn("WARNING: DATABASE_URL env variable is not defined.");
}

const sql = neon(databaseUrl || "postgresql://mock:mock@localhost:5432/mock");
export const db = drizzle({ client: sql, schema });
