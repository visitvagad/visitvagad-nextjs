/**
 * Create a super admin user for VisitVagad
 * Run: npm run create:admin
 *
 * This creates an admin user with the following credentials:
 * Email:    admin@visitvagad.com
 * Password: Admin@123456
 *
 * Safe to re-run — will update existing user if already present.
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { Client, Users, ID } from 'node-appwrite';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

const ADMIN_EMAIL = 'admin@visitvagad.com';
const ADMIN_PASSWORD = 'Admin@123456';

if (!endpoint || !projectId || !apiKey) {
  console.error('✗ Missing env vars. Set NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID, APPWRITE_API_KEY');
  process.exit(1);
}

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
const users = new Users(client);

async function main() {
  console.log('🔐 Creating VisitVagad Admin User\n');

  try {
    // Check if user already exists
    const userList = await users.list();
    const existingUser = userList.users.find((u) => u.email === ADMIN_EMAIL);

    if (existingUser) {
      console.log(`ℹ Admin user already exists: ${ADMIN_EMAIL}`);
      console.log(`  ID: ${existingUser.$id}`);

      // Update labels if needed
      const hasAdminLabel = existingUser.labels?.includes('superadmin') || existingUser.labels?.includes('super_admin');
      if (!hasAdminLabel) {
        console.log('  Adding superadmin label...');
        await users.updateLabels(existingUser.$id, [...(existingUser.labels || []).filter(l => l !== 'super_admin'), 'superadmin']);
        console.log('  ✓ Label added');
      } else {
        console.log('  ✓ superadmin label already present');
      }
    } else {
      // Create new user
      console.log(`Creating user: ${ADMIN_EMAIL}`);
      const newUser = await users.create(ID.unique(), ADMIN_EMAIL, undefined, ADMIN_PASSWORD, 'Admin User');
      console.log(`✓ User created: ${newUser.$id}`);

      // Add superadmin label
      console.log('Adding superadmin label...');
      await users.updateLabels(newUser.$id, ['superadmin']);
      console.log('✓ Label added');
    }

    console.log('\n✅ Admin user setup complete!\n');
    console.log('Login credentials:');
    console.log(`  Email:    ${ADMIN_EMAIL}`);
    console.log(`  Password: ${ADMIN_PASSWORD}`);
    console.log(`\nAccess dashboard: http://localhost:3000/admin`);
  } catch (error) {
    console.error('✗ Error creating admin user:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
