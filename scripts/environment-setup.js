#!/usr/bin/env node
/**
 * Environment Setup Script
 * Ensures database and environment are properly configured across all environments
 */

import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';

// Lazy import functions to avoid issues when database is not configured
async function importSetupSchema() {
  try {
    const module = await import('./setup-turso-db.js');
    return module.setupSchema;
  } catch (error) {
    return null;
  }
}

async function importRunMigration() {
  try {
    const module = await import('./migrate-sqlite-to-turso.js');
    return module.runMigration;
  } catch (error) {
    return null;
  }
}

class EnvironmentSetup {
  constructor() {
    this.environment = process.env.NODE_ENV || 'development';
    this.isProduction = this.environment === 'production';
    this.isCI = !!process.env.CI;
    this.TURSO_URL = process.env.TURSO_DATABASE_URL;
    this.TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;
  }

  log(message, type = 'info') {
    const prefix = {
      info: '📋',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };
    console.log(`${prefix[type]} ${message}`);
  }

  async checkEnvironmentVariables() {
    this.log('Checking environment variables...', 'info');
    
    // Check for placeholder/invalid values
    const hasValidTursoUrl = this.TURSO_URL && !this.TURSO_URL.includes('your-database') && this.TURSO_URL.startsWith('libsql://');
    const hasValidToken = this.TURSO_AUTH_TOKEN && this.TURSO_AUTH_TOKEN !== 'your_turso_auth_token_here' && this.TURSO_AUTH_TOKEN.length > 10;
    
    if (!hasValidTursoUrl) {
      if (this.isProduction || this.isCI) {
        throw new Error('Valid TURSO_DATABASE_URL is required in production/CI');
      } else {
        this.log('TURSO_DATABASE_URL not configured properly - using fallback for development', 'warning');
        return false;
      }
    }
    
    if (!hasValidToken) {
      if (this.isProduction || this.isCI) {
        this.log('TURSO_AUTH_TOKEN not properly configured - some features may not work', 'warning');
      } else {
        this.log('TURSO_AUTH_TOKEN not configured properly - using fallback for development', 'warning');
        return false;
      }
    }
    
    this.log('Environment variables validated', 'success');
    return true;
  }

  async testDatabaseConnection() {
    if (!this.TURSO_URL) {
      this.log('Skipping database connection test (no URL configured)', 'warning');
      return false;
    }

    this.log('Testing database connection...', 'info');
    
    try {
      const client = createClient({
        url: this.TURSO_URL,
        authToken: this.TURSO_AUTH_TOKEN || undefined
      });
      
      await client.execute('SELECT 1 as test');
      this.log('Database connection successful', 'success');
      return true;
    } catch (error) {
      throw new Error(`Database connection failed: ${error.message}`);
    }
  }

  async checkDatabaseTables() {
    if (!this.TURSO_URL) {
      this.log('Skipping table check (no database URL)', 'warning');
      return false;
    }

    this.log('Checking database tables...', 'info');
    
    const client = createClient({
      url: this.TURSO_URL,
      authToken: this.TURSO_AUTH_TOKEN || undefined
    });
    
    const expectedTables = [
      'services', 'formations', 'team_members', 'testimonials', 
      'faqs', 'gallery_items', 'reservations', 'contact_messages', 
      'time_slots', 'site_settings'
    ];
    
    try {
      const tablesResult = await client.execute(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name NOT LIKE 'sqlite_%'
        ORDER BY name
      `);
      
      const existingTables = tablesResult.rows.map(row => row.name);
      const missingTables = expectedTables.filter(table => !existingTables.includes(table));
      
      if (missingTables.length > 0) {
        this.log(`Missing tables: ${missingTables.join(', ')}`, 'warning');
        return false;
      }
      
      this.log(`All ${expectedTables.length} required tables exist`, 'success');
      return true;
    } catch (error) {
      throw new Error(`Table check failed: ${error.message}`);
    }
  }

  async setupDatabase() {
    if (!this.TURSO_URL) {
      this.log('Skipping database setup (no URL configured)', 'warning');
      return;
    }

    this.log('Setting up database schema...', 'info');
    
    try {
      const setupSchema = await importSetupSchema();
      if (!setupSchema) {
        throw new Error('Could not load database setup module');
      }
      await setupSchema();
      this.log('Database schema setup completed', 'success');
    } catch (error) {
      throw new Error(`Database setup failed: ${error.message}`);
    }
  }

  async migrateData() {
    if (!this.TURSO_URL) {
      this.log('Skipping data migration (no database URL)', 'warning');
      return;
    }

    // Check if there's existing data to migrate
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      this.log('No data directory found, skipping migration', 'warning');
      return;
    }

    const sqliteFiles = fs.readdirSync(dataDir).filter(file => file.endsWith('.sqlite'));
    if (sqliteFiles.length === 0) {
      this.log('No SQLite files found, skipping migration', 'info');
      return;
    }

    this.log('Migrating existing data...', 'info');
    
    try {
      const runMigration = await importRunMigration();
      if (!runMigration) {
        throw new Error('Could not load migration module');
      }
      await runMigration();
      this.log('Data migration completed', 'success');
    } catch (error) {
      // Migration errors are non-fatal in most cases
      this.log(`Data migration warning: ${error.message}`, 'warning');
    }
  }

  async createEnvFileIfNeeded() {
    const envFile = path.join(process.cwd(), '.env');
    const envExampleFile = path.join(process.cwd(), '.env.example');
    
    if (!fs.existsSync(envFile) && fs.existsSync(envExampleFile)) {
      this.log('Creating .env file from template...', 'info');
      fs.copyFileSync(envExampleFile, envFile);
      this.log('⚠️  Please update .env with your actual configuration values', 'warning');
    }
  }

  async run() {
    console.log(`🚀 Neill Beauty Environment Setup - ${this.environment.toUpperCase()}\n`);
    
    try {
      // Step 1: Create .env file if needed (development only)
      if (!this.isProduction && !this.isCI) {
        await this.createEnvFileIfNeeded();
      }
      
      // Step 2: Check environment variables
      const hasValidEnv = await this.checkEnvironmentVariables();
      
      if (hasValidEnv) {
        // Step 3: Test database connection
        await this.testDatabaseConnection();
        
        // Step 4: Check if tables exist
        const tablesExist = await this.checkDatabaseTables();
        
        if (!tablesExist) {
          // Step 5: Setup database schema
          await this.setupDatabase();
          
          // Step 6: Migrate existing data
          await this.migrateData();
          
          // Step 7: Verify setup
          await this.checkDatabaseTables();
        }
      }
      
      console.log('\n🎉 Environment setup completed successfully!');
      
      // Provide next steps
      console.log('\n📋 Next steps:');
      if (!hasValidEnv) {
        console.log('  1. Configure your .env file with Turso credentials');
        console.log('  2. Run this script again: npm run environment-setup');
      } else {
        console.log('  1. Start development: npm run dev');
        console.log('  2. Run health check: npm run health-check');
        console.log('  3. Access admin: http://localhost:4321/admin');
      }
      
    } catch (error) {
      this.log(`Setup failed: ${error.message}`, 'error');
      console.log('\n💡 Troubleshooting:');
      console.log('  1. Verify TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are correct');
      console.log('  2. Check Turso database is accessible');
      console.log('  3. Run diagnostics: npm run turso-diagnostics');
      process.exit(1);
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const setup = new EnvironmentSetup();
  setup.run();
}

export { EnvironmentSetup };