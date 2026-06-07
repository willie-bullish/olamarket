const crypto = require('crypto');

// Replace with the password you want to check
const passwordToCheck = 'your-password-here';

// Generate the SHA-256 hash
const hash = crypto.createHash('sha256').update(passwordToCheck).digest('hex');

console.log('Password:', passwordToCheck);
console.log('SHA-256 Hash:', hash);

// If you know the stored hash, compare it:
const storedHash = 'paste-your-stored-hash-here';
console.log('Match:', hash === storedHash);