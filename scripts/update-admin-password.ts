/**
 * Update admin password for VisitVagad
 * Run: npx tsx scripts/update-admin-password.ts
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { Client, Users } from 'node-appwrite';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

const ADMIN_EMAIL = 'admin@visitvagad.com';
const NEW_PASSWORD = 'Admin@123456';

if (!endpoint || !projectId || !apiKey) {
  console.error('✗ Missing env vars. Set NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID, APPWRITE_API_KEY');
  process.exit(1);
}

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
const users = new Users(client);

async function main() {
  console.log('🔐 Updating VisitVagad Admin Password\n');

  try {
    // Find admin user
    const userList = await users.list();
    const adminUser = userList.users.find((u) => u.email === ADMIN_EMAIL);

    if (!adminUser) {
      console.error(`✗ Admin user not found: ${ADMIN_EMAIL}`);
      process.exit(1);
    }

    console.log(`Found admin user: ${ADMIN_EMAIL}`);
    console.log(`  ID: ${adminUser.$id}`);

    // Update password
    console.log('Updating password...');
    await users.updatePassword(adminUser.$id, NEW_PASSWORD);
    console.log('✓ Password updated successfully');

    console.log('\n✅ Admin password update complete!\n');
    console.log('Login credentials:');
    console.log(`  Email:    ${ADMIN_EMAIL}`);
    console.log(`  Password: ${NEW_PASSWORD}`);
    console.log(`\nAccess dashboard: http://localhost:3000/admin`);
  } catch (error) {
    console.error('✗ Error updating password:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
