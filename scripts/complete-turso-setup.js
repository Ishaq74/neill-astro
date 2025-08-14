#!/usr/bin/env node
/**
 * Complete Turso Setup Script
 * 1. Creates database schema in Turso
 * 2. Migrates existing SQLite data to Turso
 */

import { setupSchema } from './setup-turso-db.js';
import { runMigration } from './migrate-sqlite-to-turso.js';

async function completeSetup() {
  console.log('🚀 Starting complete Turso database setup...\n');
  
  try {
    console.log('📋 Step 1: Setting up database schema...');
    await setupSchema();
    
    console.log('\n📋 Step 2: Migrating existing data...');
    await runMigration();
    
    console.log('\n🎉 Complete setup finished successfully!');
    console.log('\n🔧 Your Turso database is now ready with:');
    console.log('  ✅ All required tables created');
    console.log('  ✅ All existing data migrated');
    console.log('  ✅ Admin dashboard should now work');
    
    console.log('\n🌐 Ready for production deployment!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    console.log('\n🔍 Troubleshooting:');
    console.log('  1. Verify TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are set correctly');
    console.log('  2. Check that your Turso database is accessible');
    console.log('  3. Ensure auth token has the right permissions');
    console.log('  4. Check the Turso dashboard for any connection issues');
    process.exit(1);
  }
}

completeSetup();