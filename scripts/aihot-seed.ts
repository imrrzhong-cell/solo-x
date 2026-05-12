import { neon } from "@neondatabase/serverless";
import { seedSources, SEED_SOURCES } from "../lib/aihot/seed-sources";

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }
  const sql = neon(process.env.DATABASE_URL);
  await seedSources(sql);
  console.log(`Seeded ${SEED_SOURCES.length} sources`);
}

main().catch(console.error);
