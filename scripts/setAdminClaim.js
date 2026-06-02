#!/usr/bin/env node
import admin from 'firebase-admin';
import fs from 'fs';

const keyPath = new URL('../serviceAccountKey.json', import.meta.url).pathname;

if (!fs.existsSync(keyPath)) {
  console.error('serviceAccountKey.json not found at', keyPath);
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, 'utf8'))),
});

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('Usage: node scripts/setAdminClaim.js <email> [true|false]');
  process.exit(1);
}

const email = args[0];
const makeAdmin = args[1] !== 'false';

async function run() {
  try {
    const user = await admin.auth().getUserByEmail(email);
    console.log('Found user:', user.uid, user.email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: makeAdmin });
    console.log(`Set admin=${makeAdmin} for ${email} (uid: ${user.uid})`);
    console.log('Note: The user must sign out and sign back in for new claims to take effect.');
    process.exit(0);
  } catch (err) {
    console.error('Error setting custom claim:', err.message || err);
    process.exit(1);
  }
}

run();
