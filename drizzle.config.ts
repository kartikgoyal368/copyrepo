import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  // During build / generation, database url might be absent. Provide a fallback to avoid errors.
  console.log("DATABASE_URL is not set. Using local development schema parsing.");
}

export default defineConfig({
  schema: "./src/server/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://localhost:5432/ecosphere",
  },
});
