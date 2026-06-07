require('dotenv').config({ path: '.env.local' });
const postgres = require('postgres');

const sql = postgres(process.env.DATABASE_URL || '');

async function showPasswords() {
  const result = await sql`
    SELECT email, name, password_plain FROM users ORDER BY created_at DESC
  `;

  console.log('Total users: ' + result.length);
  console.log('--- User Passwords (Development Only) ---');
  
  for (let i = 0; i < result.length; i++) {
    const user = result[i];
    console.log(String(i + 1) + '. Email: ' + user.email);
    console.log('   Name: ' + user.name);
    console.log('   Password: ' + (user.password_plain || '(none)'));
    console.log('');
  }
  console.log('-------------------------------------------');

  await sql.end();
}

showPasswords();