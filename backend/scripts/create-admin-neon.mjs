import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

const userId = process.env.ADMIN_ID || 'admin-001';
const email = process.env.ADMIN_EMAIL || 'admin@example.com';
const fullName = process.env.ADMIN_NAME || 'Administrator';

async function createAdmin() {
    try {
        console.log('Creating admin user...');

        // Insert user
        await sql`
      INSERT INTO users (id, email, full_name)
      VALUES (${userId}, ${email}, ${fullName})
      ON CONFLICT (id) DO UPDATE 
      SET email = ${email}, full_name = ${fullName}
    `;

        console.log(`✅ User created: ${email}`);

        // Add admin role
        await sql`
      INSERT INTO user_roles (user_id, role)
      VALUES (${userId}, 'admin')
      ON CONFLICT (user_id, role) DO NOTHING
    `;

        console.log('✅ Admin role assigned');
        console.log('\n🎉 Admin user ready!');
        console.log(`   ID: ${userId}`);
        console.log(`   Email: ${email}`);
        console.log(`   Name: ${fullName}`);

    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
}

createAdmin();
