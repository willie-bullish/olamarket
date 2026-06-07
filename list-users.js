require('dotenv').config();
const postgres = require('postgres');

const sql = postgres(process.env.DATABASE_URL || '');

async function listUsers() {
  const result = await sql`
    SELECT email, name, created_at FROM users ORDER BY created_at DESC
  `;
  
  console.log(`\nTotal users: ${result.length}\n`);
  console.log('--- All Users ---');
  result.forEach((user, i) => {
    console.log(`${i + 1}. ${user.email} (${user.name}) - Created: ${user.created_at}`);
  });
  console.log('-----------------\n`);
  
  await sql.end();
}

listUsers();