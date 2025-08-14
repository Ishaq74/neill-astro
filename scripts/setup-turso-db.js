#!/usr/bin/env node
/**
 * Turso Database Schema Setup Script
 * Creates all necessary tables in the Turso database for Neill Beauty
 */

import { createClient } from '@libsql/client';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_URL) {
  console.error('❌ TURSO_DATABASE_URL environment variable is required');
  process.exit(1);
}

const client = createClient({
  url: TURSO_URL,
  authToken: TURSO_AUTH_TOKEN || undefined
});

async function setupSchema() {
  console.log('🚀 Setting up Neill Beauty database schema in Turso...');

  try {
    // Create services table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        icon_name TEXT,
        image_path TEXT,
        features TEXT, -- JSON array
        price TEXT,
        sort_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Services table created');

    // Create formations table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS formations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        subtitle TEXT,
        description TEXT NOT NULL,
        level TEXT,
        duration TEXT,
        participants TEXT,
        price TEXT,
        features TEXT, -- JSON array
        image_path TEXT,
        badge TEXT,
        sort_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Formations table created');

    // Create team_members table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS team_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        speciality TEXT,
        image_path TEXT,
        experience TEXT,
        description TEXT,
        certifications TEXT, -- JSON array
        achievements TEXT, -- JSON array
        social_instagram TEXT,
        social_linkedin TEXT,
        social_email TEXT,
        sort_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Team members table created');

    // Create testimonials table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        role TEXT,
        image_path TEXT,
        rating INTEGER DEFAULT 5,
        text TEXT NOT NULL,
        service TEXT,
        sort_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Testimonials table created');

    // Create faqs table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS faqs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        category TEXT,
        sort_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ FAQs table created');

    // Create gallery_items table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS gallery_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        image_path TEXT NOT NULL,
        category TEXT,
        description TEXT,
        sort_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Gallery items table created');

    // Create reservations table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        service TEXT NOT NULL,
        preferred_date TEXT NOT NULL,
        preferred_time TEXT NOT NULL,
        special_requests TEXT,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled')),
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Reservations table created');

    // Create contact_messages table
    await client.execute(`
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
    console.log('✅ Contact messages table created');

    // Create time_slots table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS time_slots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        is_available BOOLEAN DEFAULT 1,
        service_type TEXT,
        reserved_by INTEGER,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(date, start_time),
        FOREIGN KEY (reserved_by) REFERENCES reservations (id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Time slots table created');

    // Create site_settings table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INTEGER PRIMARY KEY DEFAULT 1,
        site_name TEXT DEFAULT 'Neill Beauty',
        site_description TEXT,
        contact_email TEXT,
        contact_phone TEXT,
        contact_address TEXT,
        social_instagram TEXT,
        social_facebook TEXT,
        social_tiktok TEXT,
        business_hours TEXT,
        smtp_host TEXT,
        smtp_port INTEGER DEFAULT 587,
        smtp_username TEXT,
        smtp_password TEXT,
        smtp_secure BOOLEAN DEFAULT 1,
        smtp_from_name TEXT DEFAULT 'Neill Beauty Contact',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        CHECK (id = 1)
      )
    `);
    console.log('✅ Site settings table created');

    // Insert default site settings if not exists
    await client.execute(`
      INSERT OR IGNORE INTO site_settings (id, site_name, site_description)
      VALUES (1, 'Neill Beauty', 'Professional beauty services')
    `);
    console.log('✅ Default site settings inserted');

    console.log('🎉 Database schema setup completed successfully!');
    console.log('📊 Next steps:');
    console.log('  1. Set TURSO_AUTH_TOKEN in your environment variables');
    console.log('  2. Import existing data from SQLite files if needed');
    console.log('  3. Test API endpoints');

  } catch (error) {
    console.error('❌ Error setting up database schema:', error);
    process.exit(1);
  } finally {
    client.close();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupSchema();
}

export { setupSchema };