#!/usr/bin/env node
/**
 * Turso Database Diagnostic Script
 * Checks connection and basic setup status
 */

import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';

const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

async function runDiagnostics() {
  console.log('🔍 Running Turso Database Diagnostics...\n');

  // Check 1: Environment Variables
  console.log('📋 1. Environment Variables Check:');
  if (!TURSO_URL) {
    console.log('  ❌ TURSO_DATABASE_URL is not set');
  } else {
    console.log('  ✅ TURSO_DATABASE_URL is set');
    console.log(`     URL: ${TURSO_URL}`);
  }

  if (!TURSO_AUTH_TOKEN) {
    console.log('  ⚠️  TURSO_AUTH_TOKEN is not set (optional for some setups)');
  } else {
    console.log('  ✅ TURSO_AUTH_TOKEN is set');
    console.log(`     Token: ${TURSO_AUTH_TOKEN.substring(0, 20)}...`);
  }

  if (!TURSO_URL) {
    console.log('\n❌ Cannot proceed without TURSO_DATABASE_URL');
    console.log('💡 Set your environment variables first:');
    console.log('   export TURSO_DATABASE_URL="your_database_url"');
    console.log('   export TURSO_AUTH_TOKEN="your_auth_token"');
    return;
  }

  // Check 2: Database Connection
  console.log('\n📋 2. Database Connection Test:');
  try {
    const client = createClient({
      url: TURSO_URL,
      authToken: TURSO_AUTH_TOKEN || undefined
    });

    await client.execute('SELECT 1 as test');
    console.log('  ✅ Successfully connected to Turso database');
    
    // Check 3: Tables Existence
    console.log('\n📋 3. Database Tables Check:');
    const expectedTables = [
      'services', 'formations', 'team_members', 'testimonials', 
      'faqs', 'gallery_items', 'reservations', 'contact_messages', 
      'time_slots', 'site_settings'
    ];

    const tablesResult = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `);
    
    const existingTables = tablesResult.rows.map(row => row.name);
    console.log(`  Found ${existingTables.length} tables:`, existingTables);

    let missingTables = [];
    for (const table of expectedTables) {
      if (existingTables.includes(table)) {
        console.log(`  ✅ ${table} exists`);
      } else {
        console.log(`  ❌ ${table} missing`);
        missingTables.push(table);
      }
    }

    // Check 4: Data Count
    if (missingTables.length === 0) {
      console.log('\n📋 4. Data Count Check:');
      for (const table of expectedTables) {
        try {
          const countResult = await client.execute(`SELECT COUNT(*) as count FROM ${table}`);
          const count = countResult.rows[0]?.count || 0;
          console.log(`  📊 ${table}: ${count} rows`);
        } catch (error) {
          console.log(`  ❌ Error counting ${table}: ${error.message}`);
        }
      }
    }

    // Check 5: Local SQLite Data
    console.log('\n📋 5. Local SQLite Data Check:');
    const dataDir = './data';
    if (fs.existsSync(dataDir)) {
      const sqliteFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.sqlite'));
      console.log(`  📁 Found ${sqliteFiles.length} local SQLite files:`, sqliteFiles);
      
      if (sqliteFiles.length > 0 && missingTables.length > 0) {
        console.log('  💡 You have local data that can be migrated!');
        console.log('     Run: npm run migrate-to-turso');
      }
    } else {
      console.log('  ⚠️  No local data directory found');
    }

    await client.close();

    // Summary and Recommendations
    console.log('\n📋 6. Summary and Recommendations:');
    if (missingTables.length > 0) {
      console.log('  🔧 Setup needed:');
      console.log('     1. Run: npm run turso-complete-setup');
      console.log('     2. Or: npm run setup-turso (schema only)');
    } else {
      console.log('  ✅ Database setup looks good!');
      console.log('     Your Turso database is ready to use.');
    }

  } catch (error) {
    console.log(`  ❌ Connection failed: ${error.message}`);
    console.log('\n🔍 Troubleshooting:');
    console.log('  1. Verify your TURSO_DATABASE_URL is correct');
    console.log('  2. Check that TURSO_AUTH_TOKEN has proper permissions');
    console.log('  3. Ensure your Turso database is active');
    console.log('  4. Check network connectivity to Turso');
  }

  console.log('\n🎯 Next Steps:');
  console.log('  • If setup is needed: npm run turso-complete-setup');
  console.log('  • Test your application: npm run dev');  
  console.log('  • Access admin panel: http://localhost:4321/admin');
}

runDiagnostics().catch(console.error);