require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { query } = require('./db');

async function setupDatabase() {
  try {
    const schemaPath = path.join(__dirname, '../../..', 'docs', 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    await query(sql);
    console.log('Database setup complete — all tables created successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Database setup failed:', err.message);
    process.exit(1);
  }
}

setupDatabase();
