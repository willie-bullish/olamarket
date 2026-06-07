require('dotenv').config({ path: '.env.local' });
const postgres = require('postgres');

const sql = postgres(process.env.DATABASE_URL || '');

async function getUserHash() {
  const email = process.argv[2] || 'caalstonny18@gmail.com';
  const result = await sql`
    SELECT email, password_hash FROM users WHERE email = ${email}
  `;
  
  if (result.length === 0) {
    console.log('User not found');
  } else {
    console.log('Email:', result[0].email);
    console.log('Password Hash:', result[0].password_hash);
  }
  
  await sql.end();
}

getUserHash();