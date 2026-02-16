import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../profiles.db');
const db = new Database(dbPath);

const USER_ID = '784bc459-a28a-4b82-bfcd-34ad62d89f27';
const EMAIL = 'admin@local.test'; // Placeholder email
const FULL_NAME = 'Admin User';

console.log(`Setting admin role for user: ${USER_ID}`);

try {
  // 1. Ensure user exists
  db.prepare(`
    INSERT INTO users (id, email, full_name)
    VALUES (?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET email=excluded.email, full_name=excluded.full_name
  `).run(USER_ID, EMAIL, FULL_NAME);
  console.log('- User record ensured.');

  // 2. Assign 'admin' role
  db.prepare(`
    INSERT OR IGNORE INTO user_roles (user_id, role)
    VALUES (?, 'admin')
  `).run(USER_ID);
  console.log('- Admin role assigned.');

  // 3. Verify
  const roles = db.prepare('SELECT role FROM user_roles WHERE user_id = ?').all(USER_ID);
  console.log(`- Current roles for ${USER_ID}:`, roles.map(r => r.role));

} catch (err) {
  console.error('Error setting admin:', err);
  process.exit(1);
}

console.log('Done.');
