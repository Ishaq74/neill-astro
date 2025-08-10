#!/usr/bin/env node
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database path
const dbPath = join(__dirname, '../data/contact.sqlite');

try {
  const db = new Database(dbPath);
  
  // Create contact_messages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'new' CHECK(status IN ('new', 'read', 'replied', 'archived')),
      admin_reply TEXT,
      replied_at DATETIME,
      replied_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  console.log('✅ Contact messages table created successfully');
  
  // Add SMTP configuration to site_settings if not exists
  const siteSettingsDb = new Database(join(__dirname, '../data/site_settings.sqlite'));
  
  // Check if SMTP columns exist, if not add them
  try {
    siteSettingsDb.exec(`
      ALTER TABLE site_settings ADD COLUMN smtp_host TEXT;
    `);
  } catch (e) {
    // Column might already exist
  }
  
  try {
    siteSettingsDb.exec(`
      ALTER TABLE site_settings ADD COLUMN smtp_port INTEGER DEFAULT 587;
    `);
  } catch (e) {
    // Column might already exist
  }
  
  try {
    siteSettingsDb.exec(`
      ALTER TABLE site_settings ADD COLUMN smtp_username TEXT;
    `);
  } catch (e) {
    // Column might already exist
  }
  
  try {
    siteSettingsDb.exec(`
      ALTER TABLE site_settings ADD COLUMN smtp_password TEXT;
    `);
  } catch (e) {
    // Column might already exist
  }
  
  try {
    siteSettingsDb.exec(`
      ALTER TABLE site_settings ADD COLUMN smtp_secure BOOLEAN DEFAULT 1;
    `);
  } catch (e) {
    // Column might already exist
  }
  
  try {
    siteSettingsDb.exec(`
      ALTER TABLE site_settings ADD COLUMN smtp_from_name TEXT DEFAULT 'Neill Beauty Contact';
    `);
  } catch (e) {
    // Column might already exist
  }
  
  console.log('✅ SMTP configuration columns added to site_settings');
  
  db.close();
  siteSettingsDb.close();
  
  console.log('🎉 Database setup completed successfully!');
} catch (error) {
  console.error('❌ Error setting up database:', error);
  process.exit(1);
}