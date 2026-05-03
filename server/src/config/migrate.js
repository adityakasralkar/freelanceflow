require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { query } = require('./db');

async function runMigrations() {
  try {
    const migrationsDir = path.join(__dirname, '../../..', 'docs', 'migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      console.log(`Applying ${file}...`);
      await query(sql);
    }

    console.log(`Applied ${files.length} migration(s).`);
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
}

runMigrations();
