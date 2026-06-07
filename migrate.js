require('dotenv').config({ path: '.env.local' });
const postgres = require('postgres');

const sql = postgres(process.env.DATABASE_URL || '');

async function migrate() {
  console.log('Running migration: Add password_plain column...');
  
  try {
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS password_plain TEXT`;
    console.log('✅ Column password_plain added successfully');
  } catch (error) {
    if (error.code === '42701') {
      console.log('ℹ️ Column password_plain already exists');
    } else {
      console.error('❌ Migration failed:', error.message);
    }
  }
  
  await sql.end();
}

migrate();