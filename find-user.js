const postgres = require('postgres');

const sql = postgres(process.env.DATABASE_URL || '');

async function findUser() {
  const email = process.argv[2];
  if (!email) {
    console.log('Usage: node find-user.js email@example.com');
    return;
  }
  
  const result = await sql`
    SELECT email, password_hash FROM users WHERE email = ${email.toLowerCase()}
  `;
  
  if (result.length === 0) {
    console.log('User not found');
  } else {
    console.log('Email:', result[0].email);
    console.log('Password Hash:', result[0].password_hash);
  }
  
  await sql.end();
}

findUser();