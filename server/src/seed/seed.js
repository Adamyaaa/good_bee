import 'dotenv/config';
import { initPostgres, isConnected, getPool } from '../db/pg.js';
import { seedNeonDatabase } from '../db/seedCloud.js';

async function run() {
  const ok = await initPostgres();
  if (!ok || !isConnected()) {
    console.error('Could not connect to PostgreSQL. Check DATABASE_URL in server/.env');
    process.exit(1);
  }
  await seedNeonDatabase();
  const pool = getPool();
  if (pool) await pool.end();
  console.log('✅ Manual seed completed.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
