#!/usr/bin/env node
/**
 * SQLite to Turso Data Migration Script
 * Migrates all existing data from local SQLite databases to Turso (libSQL)
 */

import { createClient } from '@libsql/client';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_URL) {
  console.error('❌ TURSO_DATABASE_URL environment variable is required');
  console.error('💡 Make sure to set your Turso database URL and token first');
  process.exit(1);
}

console.log('🚀 Starting SQLite to Turso migration...');
console.log(`📡 Connecting to Turso: ${TURSO_URL}`);

const tursoClient = createClient({
  url: TURSO_URL,
  authToken: TURSO_AUTH_TOKEN || undefined
});

const dataDir = join(__dirname, '../data');

// Mapping of SQLite files to their corresponding tables in Turso
const migrationMap = {
  'services.sqlite': ['services'],
  'formations.sqlite': ['formations'],
  'team.sqlite': ['team_members'],
  'testimonials.sqlite': ['testimonials'],
  'faqs.sqlite': ['faqs'],
  'gallery.sqlite': ['gallery_items'],
  'reservations.sqlite': ['reservations', 'time_slots'],
  'contact.sqlite': ['contact_messages'],
  'site_settings.sqlite': ['site_settings']
};

// Tables that should use gallery_items instead of gallery
const tableNameMap = {
  'gallery': 'gallery_items'
};

async function migrateTable(sqliteDb, tableName, tursoClient) {
  const targetTable = tableNameMap[tableName] || tableName;
  
  try {
    console.log(`📊 Migrating ${tableName} -> ${targetTable}...`);
    
    // Get all data from SQLite table
    const rows = sqliteDb.prepare(`SELECT * FROM ${tableName}`).all();
    
    if (rows.length === 0) {
      console.log(`  ⚠️  No data in ${tableName}, skipping...`);
      return;
    }
    
    // Get column names from the first row
    const columns = Object.keys(rows[0]);
    const placeholders = columns.map(() => '?').join(', ');
    const columnNames = columns.join(', ');
    
    // Clear existing data in Turso (optional - comment out if you want to preserve existing data)
    await tursoClient.execute(`DELETE FROM ${targetTable}`);
    console.log(`  🧹 Cleared existing data in ${targetTable}`);
    
    // Insert data batch by batch to avoid limits
    const batchSize = 100;
    let successCount = 0;
    
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      
      for (const row of batch) {
        try {
          const values = columns.map(col => row[col]);
          await tursoClient.execute({
            sql: `INSERT INTO ${targetTable} (${columnNames}) VALUES (${placeholders})`,
            args: values
          });
          successCount++;
        } catch (error) {
          console.error(`  ❌ Failed to insert row in ${targetTable}:`, error.message);
          console.error(`     Row data:`, row);
        }
      }
      
      // Show progress for large tables
      if (rows.length > 50) {
        console.log(`  📈 Progress: ${Math.min(i + batchSize, rows.length)}/${rows.length} rows`);
      }
    }
    
    console.log(`  ✅ Successfully migrated ${successCount}/${rows.length} rows to ${targetTable}`);
    
  } catch (error) {
    console.error(`  ❌ Error migrating ${tableName}:`, error.message);
  }
}

async function runMigration() {
  try {
    console.log('🔍 Scanning SQLite databases...');
    
    // Check which SQLite files exist
    const sqliteFiles = fs.readdirSync(dataDir)
      .filter(file => file.endsWith('.sqlite'))
      .filter(file => migrationMap[file]); // Only process files we know how to handle
    
    console.log(`📁 Found ${sqliteFiles.length} SQLite databases to migrate`);
    
    for (const file of sqliteFiles) {
      console.log(`\n📂 Processing ${file}...`);
      
      const filePath = join(dataDir, file);
      const sqliteDb = new Database(filePath, { readonly: true });
      
      try {
        // Get the tables for this file
        const tablesToMigrate = migrationMap[file];
        
        // Get actual tables that exist in the SQLite database
        const existingTables = sqliteDb.prepare(
          "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
        ).all().map(row => row.name);
        
        // Migrate each table that exists and is in our migration map
        for (const tableName of tablesToMigrate) {
          if (existingTables.includes(tableName)) {
            await migrateTable(sqliteDb, tableName, tursoClient);
          } else {
            console.log(`  ⚠️  Table ${tableName} not found in ${file}, skipping...`);
          }
        }
        
      } finally {
        sqliteDb.close();
      }
    }
    
    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('  1. Test your application to ensure data was migrated correctly');
    console.log('  2. Check the admin dashboard to verify data is accessible');
    console.log('  3. Consider backing up your SQLite files before removing them');
    console.log('  4. Update your environment variables in production to use Turso');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    tursoClient.close();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration();
}

export { runMigration };